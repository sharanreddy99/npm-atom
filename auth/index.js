// Third party packages
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

// Custom packages
const auth = require("../middleware").AuthMiddleware;
const constants = require("../constants");
const logger = require("../logger");
const loggerutils = require("../logger/utils");
const dbutils = require("../db/utils");
const jwt = require("../jwt");
const jwtutils = require("../jwt/utils");
const utils = require("../utils");
const redis = require("../redis");
const crypt = require("../crypt");
const emailutils = require("../email/utils");

// Models
const User = require("../db/models").User;

// Setup
const router = new express.Router();
const upload = multer({
  limits: {
    fileSize: 3000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

//Routes
router.post("/user", upload.single("avatar"), async (req, res) => {
  try {
    const key = redis.GenerateKey("req_count", loggerutils.FetchIP(req));
    const registerlimit = await redis.GetData(key);
    if (
      registerlimit &&
      parseInt(registerlimit) >= constants.USER_REGISTRATION_LIMIT
    ) {
      return utils.ServeBadRequestResponse(
        req,
        res,
        new Error(
          "User registration limit exceeded. Please try again after some time."
        )
      );
    }

    await redis.IncrementDataWithExpiry(
      key,
      1,
      constants.USER_REGISTRATION_LIMIT_DURATION
    );

    const rKey = await utils.VerifyOTPAuthenticity(req, req.body.email);
    if (rKey == "") {
      utils.ServeBadRequestResponse(
        req,
        res,
        new Error(),
        "The request cannot be processed due to timeout. Please try again later."
      );
    } else {
      await redis.DeleteData(rKey);
    }

    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.body.avatar = buffer;
    }

    await dbutils.insert(User, req.body);
    utils.ServeResponse(
      req,
      res,
      201,
      "User registration successful. Please login to the app."
    );
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "register user" + constants.ERROR_SUFFIX
    );
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await jwt.GenerateAccessToken(req, user);
    utils.ServeResponse(req, res, 201, { token });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeUnauthorizedResponse(req, res);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    const key = jwtutils.GenerateAccessTokenRedisKey(req, req.user.email);
    let isValid = await redis.DeleteData(key);
    if (!isValid) {
      return utils.ServeUnauthorizedResponse(
        req,
        res,
        new Error("Session Expired. Please login again.")
      );
    }
    utils.ServeResponse(req, res, 200, "Logout successful.");
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "log user off" + constants.ERROR_SUFFIX
    );
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    utils.ServeResponse(req, res, 200, req.user);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "fetch user details" + constants.ERROR_SUFFIX
    );
  }
});

router.delete("/user", auth, async (req, res) => {
  try {
    await dbutils.deleteOne(User, { email: req.user.email });
    utils.ServeResponse(req, res, 201, "User hsa been deleted successfully.");
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "delete user" + constants.ERROR_SUFFIX
    );
  }
});

router.patch("/user", auth, upload.single("avatar"), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "displayName",
      "email",
      "password",
      "mobile",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return utils.ServeBadRequestResponse(
        req,
        res,
        new Error("Some of the fields cannot be updated.")
      );
    }

    const key = jwtutils.GenerateAccessTokenRedisKey(req, req.user.email);
    await redis.DeleteData(key);

    updates.forEach((update) => (req.user[update] = req.body[update]));
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.body.avatar = buffer;
    }

    const rKey = await utils.VerifyOTPAuthenticity(req, req.user.email);
    if (rKey == "") {
      utils.ServeBadRequestResponse(
        req,
        res,
        new Error(),
        "The request cannot be processed due to timeout. Please try again later."
      );
    } else {
      await redis.DeleteData(rKey);
    }

    await req.user.save();
    utils.ServeResponse(
      req,
      res,
      201,
      "User updated successfully. Please login again."
    );
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "update user" + constants.ERROR_SUFFIX
    );
  }
});

router.get("/verifyemail", async (req, res) => {
  try {
    let email = crypt.StringEncrypt(req.query.email);
    const user = await dbutils.findOne(User, { email: email });
    if (!user) {
      return utils.ServeBadRequestResponse(
        req,
        res,
        new Error(
          "The Email-ID specified not registered with us. Please check the email and try again."
        )
      );
    }

    utils.ServeResponse(req, res, 201, { email: req.query.email });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "verify user's email" + constants.ERROR_SUFFIX
    );
  }
});

router.get("/new/email", async (req, res) => {
  try {
    let email = crypt.StringEncrypt(req.query.email);
    const user = await dbutils.findOne(User, { email: email });
    if (user) {
      return utils.ServeBadRequestResponse(
        req,
        res,
        new Error(
          "The Email-ID is already registered with us. Please try again with another email."
        )
      );
    }

    utils.ServeResponse(req, res, 201, { email: req.query.email });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX +
        "ensure that email is not registered with us" +
        constants.ERROR_SUFFIX
    );
  }
});

router.patch("/forgotpassword", async (req, res) => {
  try {
    let email = crypt.StringEncrypt(req.body.email);
    const user = await dbutils.findOne(User, { email: email });
    if (!user) {
      return utils.ServeBadRequestResponse(
        req,
        res,
        new Error(
          "The Email-ID specified not registered with us. Please check the email and try again."
        )
      );
    }

    const rKey = await utils.VerifyOTPAuthenticity(req, req.body.email);
    if (rKey == "") {
      utils.ServeBadRequestResponse(
        req,
        res,
        new Error(),
        "The request cannot be processed due to timeout. Please try again later."
      );
    } else {
      await redis.DeleteData(rKey);
    }

    user.password = req.body.password;
    await user.save();
    utils.ServeResponse(
      req,
      res,
      201,
      "Password Changed Succesfully. You can login now."
    );
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX +
        "update password for the user" +
        constants.ERROR_SUFFIX
    );
  }
});

router.post("/encrypt", (req, res) => {
  try {
    let data = req.body.data;
    let encData = crypt.StringEncrypt(JSON.stringify(data));
    utils.ServeResponse(req, res, 201, encData);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "encrypt data" + constants.ERROR_SUFFIX
    );
  }
});

router.post("/decrypt", (req, res) => {
  try {
    let data = req.body.data;
    let decData = JSON.parse(crypt.StringDecrypt(data));
    utils.ServeResponse(req, res, 201, decData);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      constants.ERROR_PREFIX + "decrypt data" + constants.ERROR_SUFFIX
    );
  }
});

module.exports = router;

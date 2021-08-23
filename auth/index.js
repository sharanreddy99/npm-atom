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

// Models
const User = require("../db/models/users");

// Setup
const router = new express.Router();

//Routes
router.post("/register", async (req, res) => {
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

    try {
      await dbutils.insert(User, req.body.user);
    } catch (e) {
      throw new Error("DB Operation Failed: " + e.message);
    }
    utils.ServeResponse(
      req,
      res,
      201,
      "User registration successful. Please login to the app."
    );
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
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
    await redis.DeleteData(key);
    utils.ServeResponse(req, res, 200, "Logout successful.");
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    utils.ServeResponse(req, res, 200, req.user);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
  }
});

// router.patch("/users/me", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password", "age"];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }

//   try {
//     updates.forEach((update) => (req.user[update] = req.body[update]));
//     await req.user.save();
//     res.send(req.user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// router.delete("/users/me", auth, async (req, res) => {
//   try {
//     await req.user.remove();
//     sendCancelationEmail(req.user.email, req.user.name);
//     res.send(req.user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// const upload = multer({
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload an image"));
//     }

//     cb(undefined, true);
//   },
// });

// router.post(
//   "/users/me/avatar",
//   auth,
//   upload.single("avatar"),
//   async (req, res) => {
//     const buffer = await sharp(req.file.buffer)
//       .resize({ width: 250, height: 250 })
//       .png()
//       .toBuffer();
//     req.user.avatar = buffer;
//     await req.user.save();
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// router.delete("/users/me/avatar", auth, async (req, res) => {
//   req.user.avatar = undefined;
//   await req.user.save();
//   res.send();
// });

// router.get("/users/:id/avatar", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user || !user.avatar) {
//       throw new Error();
//     }

//     res.set("Content-Type", "image/png");
//     res.send(user.avatar);
//   } catch (e) {
//     res.status(404).send();
//   }
// });

module.exports = router;

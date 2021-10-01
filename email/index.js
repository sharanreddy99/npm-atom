// Third Party Packages
const express = require("express");

// Custom Packages
const constants = require("../constants");
const logger = require("../logger");
const utils = require("../utils");
const emailutils = require("./utils");
const redis = require("../redis");

// Setup
const router = new express.Router();

// Routers
/* 
{
    "email":"sharansaikonda99@gmail.com",
    "unqId":"8d5ed24c-8088-4414-9fcc-dd8556b84f21",
    "placeholders":{"otp":{}},
    "subject":"Generating OTP"
}
*/
router.post("/send", async (req, res) => {
  try {
    const body = req.body;
    await emailutils.SendMail(body, req, res);
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(constants.ERROR_PREFIX + "send email" + constants.ERROR_SUFFIX)
    );
  }
});

/*
{"email":"sharansaikonda99@gmail.com",
"otp": "21435"
}
*/
router.post("/verify", async (req, res) => {
  try {
    const otpResult = await emailutils.VerifyOTP(req);
    if (otpResult == constants.OTP_VALID) {
      const rKey = utils.GenerateOTPVerifiedRedisKey(req, req.body.email);
      await redis.SetDataWithExpiry(
        rKey,
        constants.OTP_VERIFIED_STRING,
        constants.USER_REGISTRATION_VERIFIED_EXPIRATION
      );

      utils.ServeResponse(req, res, 201, "OTP validation successful.");
    } else if (otpResult == constants.OTP_INVALID) {
      utils.ServeBadRequestResponse(
        req,
        res,
        new Error("OTP didn't match. Please try again.")
      );
    } else if (otpResult == constants.OTP_ERROR) {
      throw new Error("OTP Verification failed due to server error.");
    }
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(
      req,
      res,
      new Error(constants.ERROR_PREFIX + "verify OTP" + constants.ERROR_SUFFIX)
    );
  }
});

module.exports = router;

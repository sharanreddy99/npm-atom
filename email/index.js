// Third Party Packages
const nodemailer = require("nodemailer");
const express = require("express");

// Custom Packages
const auth = require("../middleware").AuthMiddleware;
const constants = require("../constants");
const logger = require("../logger");
const dbutils = require("../db/utils");
const utils = require("../utils");
const emailutils = require("./utils");

// Models
const Email = require("../db/models").Email;

// Setup
const router = new express.Router();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "Oauth2",
    user: process.env.HOUSEMATE_NODE_EMAIL,
    clientId: process.env.HOUSEMATE_NODE_CLIENT_ID,
    clientSecret: process.env.HOUSEMATE_NODE_CLIENT_SECRET,
    refreshToken: process.env.HOUSEMATE_NODE_REFRESH_TOKEN,
  },
});

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
    let emailObj = await dbutils.findOne(Email, { unqId: body.unqId });
    if (!emailObj) {
      throw new Error("Email Template with id - " + unqId + " not found.");
    }

    if (body.placeholders["otp"]) {
      otp = await emailutils.GenerateOTP(req);
      if (otp == "") {
        throw new Error("OTP generation failed.");
      }
      body.placeholders["OTP_VAL"] = otp;
      body.placeholders["OTP_DURATION"] = 3;
      body.placeholders["OTP_UNITS"] = "minutes";
    }
    emailObj = emailutils.UpdatePlaceholders(emailObj, body.placeholders);

    const mailOptions = {
      from: process.env.HOUSEMATE_NODE_EMAIL,
      to: body.email,
      subject: body.subject,
      html: emailObj.htmlbody,
      text: emailObj.textbody,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        throw err;
      }
      utils.ServeResponse(req, res, 201);
    });
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
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
      utils.ServeResponse(req, res, 201, "OTP validation successful.");
    } else if (otpResult == constants.OTP_INVALID) {
      utils.ServeBadRequestResponse(
        req,
        res,
        new Error("OTP didn't match."),
        "OTP didn't match. Please try again."
      );
    } else if (otpResult == constants.OTP_ERROR) {
      throw new Error("OTP Verification failed due to server error.");
    }
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
  }
});

module.exports = router;
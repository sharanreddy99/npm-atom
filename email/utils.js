// Third Party Packages
const crs = require("crypto-random-string");

// Custom Packages
const redis = require("../redis");
const logger = require("../logger");
const constants = require("../constants");

// Functions
const generateOTPRedisKey = (req, email) => {
  const extra = req.APILogger.extraLogs;
  const key = redis.GenerateKey(
    "otp",
    email,
    extra.browser,
    extra.platform,
    extra.host,
    extra.ip
  );
  return key;
};

const UpdatePlaceholders = (emailObj, placeholders) => {
  for (let i = 0; i < emailObj.placeholders.length; i++) {
    let key = "{{" + emailObj.placeholders[i] + "}}";
    let val = placeholders[emailObj.placeholders[i]];
    if (emailObj.source == "TEXT") {
      emailObj.textbody = emailObj.textbody.replace(key, val);
    } else {
      emailObj.htmlbody = emailObj.htmlbody.replace(key, val);
    }
  }
  return emailObj;
};

const GenerateOTP = async (
  req,
  length = constants.OTP_LENGTH,
  type = "numeric",
  duration = constants.OTP_DURATION
) => {
  try {
    const otp = crs({ length: length, type: type });
    const otpObj = { otp: otp, retries: 0 };
    const rKey = generateOTPRedisKey(req, req.body.email);
    await redis.SetDataWithExpiry(rKey, JSON.stringify(otpObj), duration);
    return otp;
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    return "";
  }
};

const VerifyOTP = async (req) => {
  try {
    const otp = req.body.otp;
    const rKey = generateOTPRedisKey(req, req.body.email);
    let otpStr = await redis.GetData(rKey);
    let otpObj = JSON.parse(otpStr);
    if (!otpObj) {
      logger.LogMessage(req, constants.LOG_ERROR, "OTP not found");
      return constants.OTP_ERROR;
    }
    const otpTTL = await redis.GetTTL(rKey);
    if (
      otpObj.retries < constants.OTP_RETRY_LIMIT &&
      "" + otp == "" + otpObj.otp
    ) {
      await redis.DeleteData(rKey);
      logger.LogMessage(req, constants.LOG_ERROR, "OTP validated successfully");
      return constants.OTP_VALID;
    } else if (otpObj.retries < constants.OTP_RETRY_LIMIT) {
      otpObj.retries += 1;
      const temp = await redis.SetDataWithExpiry(
        rKey,
        JSON.stringify(otpObj),
        otpTTL - 3
      );
      logger.LogMessage(req, constants.LOG_ERROR, "OTP didn't match.");
      return constants.OTP_INVALID;
    } else {
      await redis.DeleteData(rKey);
      throw new Error("OTP Retry Limit exceeded");
    }
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    return constants.OTP_ERROR;
  }
};

module.exports = { GenerateOTP, VerifyOTP, UpdatePlaceholders };

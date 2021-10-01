// Custom Packages
const logger = require("../logger");
const redis = require("../redis");
const constants = require("../constants");

// Functions
const ServeResponse = async (req, res, status, data) => {
  let respData = {
    code: status,
    data: data,
    error: "",
  };
  await logger.UpdateAPILogger(req, respData);
  res.status(status).send(respData);
};

const ServeUnauthorizedResponse = async (
  req,
  res,
  err = new Error("You are not authorized. Please login again."),
  data = ""
) => {
  let status = 401;
  let respData = {
    code: status,
    data: data,
    error: err.message,
  };
  await logger.UpdateAPILogger(req, respData);
  res.status(status).send(respData);
};

const ServeBadRequestResponse = async (
  req,
  res,
  err = new Error(
    "Your request cannot be processed right now. Please try again later."
  ),
  data = ""
) => {
  let status = 400;
  let respData = {
    code: status,
    data: data,
    error: err.message,
  };
  await logger.UpdateAPILogger(req, respData);
  res.status(status).send(respData);
};

const ServeInternalServerErrorResponse = async (
  req,
  res,
  err = new Error(
    "Server couldn't process your request right now. Please try again later."
  ),
  data = ""
) => {
  let status = 500;
  let respData = {
    code: status,
    data: data,
    error: err.message,
  };
  await logger.UpdateAPILogger(req, respData);
  res.status(status).send(respData);
};

const GenerateOTPVerifiedRedisKey = (req, email) => {
  const extra = req.APILogger.extraLogs;
  const key = redis.GenerateKey(
    "otp",
    email,
    extra.browser,
    extra.platform,
    extra.host,
    extra.ip,
    constants.OTP_VERIFIED_STRING
  );
  return key;
};

const VerifyOTPAuthenticity = async (req, email) => {
  const rKey = GenerateOTPVerifiedRedisKey(req, email);
  const isOTPVerified = await redis.GetData(rKey);

  if (isOTPVerified != constants.OTP_VERIFIED_STRING) {
    return "";
  }

  return rKey;
};

module.exports = {
  ServeResponse,
  ServeUnauthorizedResponse,
  ServeInternalServerErrorResponse,
  ServeBadRequestResponse,
  GenerateOTPVerifiedRedisKey,
  VerifyOTPAuthenticity,
};

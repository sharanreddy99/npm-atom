// Logger
const LOG_INFO = "info";
const LOG_ERROR = "error";
const LOG_DEBUG = "debug";
const LOG_FOLDER_PATH = "./logs/";

// JWT Token Expiry in seconds
const JWT_TOKEN_EXPIRY = 3600;

// User Registration Limit
const USER_REGISTRATION_LIMIT = 10;
const USER_REGISTRATION_LIMIT_DURATION = 60 * 60;

// OTP
const OTP_DURATION = 3 * 60;
const OTP_LENGTH = 8;
const OTP_RETRY_LIMIT = 5;
const OTP_VALID = 0;
const OTP_INVALID = 1;
const OTP_ERROR = 2;

module.exports = {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_INFO,
  LOG_FOLDER_PATH,
  JWT_TOKEN_EXPIRY,
  USER_REGISTRATION_LIMIT,
  USER_REGISTRATION_LIMIT_DURATION,
  OTP_RETRY_LIMIT,
  OTP_VALID,
  OTP_INVALID,
  OTP_ERROR,
  OTP_DURATION,
  OTP_LENGTH,
};

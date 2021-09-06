// Logger
const LOG_INFO = "info";
const LOG_ERROR = "error";
const LOG_DEBUG = "debug";

// JWT Token Expiry in seconds
const JWT_TOKEN_EXPIRY = 3600;

// User Registration Limit
const USER_REGISTRATION_LIMIT = 10;
const USER_REGISTRATION_LIMIT_DURATION = 60 * 60;

module.exports = {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_INFO,
  JWT_TOKEN_EXPIRY,
  USER_REGISTRATION_LIMIT,
  USER_REGISTRATION_LIMIT_DURATION,
};

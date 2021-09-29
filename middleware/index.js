// Third party packages

// Custom packages
const logger = require("../logger");
const dbutils = require("../db/utils");
const jwt = require("../jwt");
const jwtutils = require("../jwt/utils");
const redis = require("../redis");
const utils = require("../utils");
const constants = require("../constants");

// Models
const User = require("../db/models").User;

// Functions
const InitAPILoggerMiddleware = async (req, res, next) => {
  try {
    await logger.InitAPILogger(req);
    next();
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
  }
};

const AuthMiddleware = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      return utils.ServeUnauthorizedResponse(
        req,
        res,
        new Error("Session Expired. Please login again.")
      );
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.VerifyAccessToken(token);
    if (decoded.error) {
      return utils.ServeUnauthorizedResponse(
        req,
        res,
        new Error("Session Expired. Please login again.")
      );
    }

    const user = await dbutils.findOne(User, { _id: decoded._id });
    if (!user) {
      return utils.ServeUnauthorizedResponse(
        req,
        res,
        new Error("Session Expired. Please login again.")
      );
    }

    const key = jwtutils.GenerateAccessTokenRedisKey(req, user.email);
    const redisAccessToken = await redis.GetData(key);
    if (!redisAccessToken) {
      return utils.ServeUnauthorizedResponse(
        req,
        res,
        new Error("Session Expired. Please login again.")
      );
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    logger.LogMessage(req, constants.LOG_ERROR, e.message);
    utils.ServeInternalServerErrorResponse(req, res);
  }
};

module.exports = { InitAPILoggerMiddleware, AuthMiddleware };

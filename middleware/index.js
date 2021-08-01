const logger = require("../logger");

const InitAPILoggerMiddleware = async(req,res,next) => {
    await logger.InitAPILogger(req)
    next();
}

module.exports = {InitAPILoggerMiddleware}
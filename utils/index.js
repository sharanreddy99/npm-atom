// Custom Packages
const logger = require("../logger");

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

module.exports = {
  ServeResponse,
  ServeUnauthorizedResponse,
  ServeInternalServerErrorResponse,
  ServeBadRequestResponse,
};

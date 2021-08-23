// Third Party Packages
const { v4: uuidv4 } = require("uuid");
const dateformat = require("dateformat");
const moment = require("moment");
const fs = require("fs");
const useragent = require("express-useragent");

// Custom Packages
const crypt = require("../crypt");
const dbutils = require("../db/utils");
const utils = require("./utils");
const constants = require("../constants");
const caller = require("./caller");

// Models
const Logs = require("../db/models/logs");

// Functions
const NewAdditionalLogger = (ua, ip, host, frameno) => {
  let e = new Error();
  let callerDetails = caller.FetchCallerDetails(e, frameno);

  let log = {
    ...callerDetails,
    browser: ua.browser,
    platform: ua.platform,
    host: host,
    os: ua.os,
    ip: ip,
  };
  return log;
};

const NewAPILogger = async (req, extraLogs) => {
  let now = new Date();
  let startDate = dateformat(now, "mmmm dS, yyyy, hh:MM:ss:l");
  let log = {
    traceid: uuidv4(),
    method: req.method,
    url: req.originalUrl,
    headers: crypt.ObjectEncrypt(req.headers),
    params: crypt.ObjectEncrypt(req.params),
    status: 100,
    error: "",
    startDate: startDate,
    endDate: startDate,
    duration: 0,
    extraLogs: extraLogs,
  };
  await logAPI(log);
  return log;
};

const UpdateAPILogger = async (req, respData) => {
  let extraLogs = PrepareExtraLogs(req, 3);
  let startMoment = moment(
    req.APILogger.startDate,
    "MMMM Do, YYYY, HH:mm:ss:SSS"
  );
  let now = new Date();
  let endDate = dateformat(now, "mmmm dS, yyyy, hh:MM:ss:l");
  let endMoment = moment(endDate, "MMMM Do, YYYY, HH:mm:ss:SSS");

  req.APILogger.extraLogs = extraLogs;
  req.APILogger.endDate = endDate;
  req.APILogger.status = respData.code;
  req.APILogger.error = respData.error;
  req.APILogger.duration = startMoment.diff(endMoment, "milliseconds");
  await logAPI(req.APILogger);
};

const InitAPILogger = async (req) => {
  let extraLogs = PrepareExtraLogs(req, 3);
  let apilog = await NewAPILogger(req, extraLogs);
  req.APILogger = apilog;
};

const PrepareExtraLogs = (req, frameno) => {
  let source = req.headers["user-agent"];
  let ua = useragent.parse(source);
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let extraLogs = NewAdditionalLogger(ua, ip, req.hostname, frameno);
  return extraLogs;
};

const LogMessage = (req, type, message) => {
  let e = new Error();
  let functionName = req ? req.method + " " + req.originalUrl + " Handler" : "";
  let callerDetails = caller.FetchCallerDetails(e, 1);
  let filePath = callerDetails.filePath;
  let lineNumber = callerDetails.lineNumber;
  let traceid = req ? req.APILogger.traceid : 0;
  let source = req ? req.headers["user-agent"] : "";
  let ua = req ? useragent.parse(source) : {};
  let ip = req ? utils.FetchIP(req) : "";
  let host = req ? req.hostname : "";
  let now = new Date();
  let date = dateformat(now, "mmmm dS, yyyy, hh:MM:ss:l");

  let extraLogs = {
    line: lineNumber,
    funcName: functionName,
    filePath: filePath,
    browser: ua.browser,
    platform: ua.platform,
    host: host,
    os: ua.os,
    ip: ip,
  };

  let log = { traceid, timestamp: date, type, message, extraLogs };
  if (log.type == constants.LOG_ERROR || log.type == constants.LOG_DEBUG) {
    var stack = new Error().stack;
    log.stack = stack;
  }

  // Log to Console
  console.log(log);

  // Log to File
  fs.writeFile(
    process.env.LOG_FILE_PATH,
    JSON.stringify(log) + "\n",
    { flag: "a+" },
    (err) => {}
  );
};

const logAPI = async (log) => {
  //Log DB
  await dbutils.insert(Logs, log);

  let newLog = {
    traceid: log.traceid,
    timestamp: log.endDate,
    type: "",
    status: log.status,
    message: "HTTP Request: " + log.method + " " + log.url,
    error: log.error,
    extra: log.extraLogs,
  };

  if (log.error !== "") {
    newLog.type = constants.LOG_ERROR;
    var stack = new Error().stack;
    newLog.stack = stack;
  } else {
    newLog.type = "info";
  }

  // Log to Console
  console.log(newLog);

  // Log to File
  fs.writeFile(
    process.env.LOG_FILE_PATH,
    JSON.stringify(newLog) + "\n",
    { flag: "a+" },
    (err) => {}
  );
};

module.exports = { InitAPILogger, UpdateAPILogger, LogMessage };

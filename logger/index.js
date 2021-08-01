// Imports
// Built in
const { v4: uuidv4 } = require('uuid');
const dateformat = require("dateformat");
const moment = require("moment");
const fs = require('fs')
const useragent = require('express-useragent');

// User Defined
const crypt = require("../crypt");
const Logs = require("../db/models/logs");
const dbutils = require("../db/utils");

// Functions
const NewAdditionalLogger = (ua,ip,host,frameno) => {
	let e = new Error() 
	let frame = e.stack.split("\n")[frameno]
	let pathInfo = /^[ ].*?at(.*?)\((.*?):([0-9]+):[0-9]+\)$/
	let match = frame.match(pathInfo)
	let functionName = match[1]
	let filePath = match[2]
	let lineNumber = parseInt(match[3])
	let id = uuidv4()
	
	let log = {
		id: id,
		line: lineNumber,
		funcName: functionName,
		filePath: filePath,
		browser: ua.browser,
		platform: ua.platform,
		host: host,
		os:ua.os,
		ip:ip
	}
	return log
}

const NewAPILogger = async (req,extraLogs) => {
	let now = new Date();
	let startDate = dateformat(now,"mmmm dS, yyyy, hh:MM:ss:l");
	let log = {
		method: req.method,
		url: req.url,
		headers: crypt.ObjectEncrypt(req.headers),
		params: crypt.ObjectEncrypt(req.params),
		status: 100,
		error: "",
		startDate: startDate,
		endDate: startDate,
		duration: 0,
		extraLogs: extraLogs
	};
	await logAPI(log);
	return log;
}

const UpdateAPILogger = async (req,respData) => {
	let extraLogs = PrepareExtraLogs(req,4);
	let startMoment = moment(req.APILogger.startDate,"MMMM Do, YYYY, HH:mm:ss:SSS");
	let now = new Date();
	let endDate = dateformat(now,"mmmm dS, yyyy, hh:MM:ss:l");
	let endMoment = moment(endDate,"MMMM Do, YYYY, HH:mm:ss:SSS");
	
	req.APILogger.extraLogs = extraLogs;
	req.APILogger.endDate = endDate;
	req.APILogger.status = respData.code;
	req.APILogger.error = respData.error;
	req.APILogger.duration = startMoment.diff(endMoment,"milliseconds");
	await logAPI(req.APILogger);
}

const InitAPILogger = async(req)=> {
    let extraLogs = PrepareExtraLogs(req,4)
	let apilog = await NewAPILogger(req,extraLogs)
    req.APILogger = apilog
}

const PrepareExtraLogs = (req,frameno) => {
	let source = req.headers['user-agent'];
    let ua = useragent.parse(source);
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    let extraLogs = NewAdditionalLogger(ua,ip,req.hostname,frameno);
	return extraLogs
}

const LogMessage = (req,type,message) => {
	let e = new Error() 
	let frame = e.stack.split("\n")[2]
	let pathInfo = /^[ ].*?at (.*?):([0-9]+):[0-9]+$/
	let match = frame.match(pathInfo)
	let functionName = req.method+" "+req.url+" Handler"
	let filePath = match[1]
	let lineNumber = parseInt(match[2])
	let id = uuidv4()
	let source = req.headers['user-agent'];
    let ua = useragent.parse(source);
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    let host = req.hostname
	
	let extraLogs = {
		id: id,
		line: lineNumber,
		funcName: functionName,
		filePath: filePath,
		browser: ua.browser,
		platform: ua.platform,
		host: host,
		os:ua.os,
		ip:ip
	}
	
	let log = {type,message,extraLogs}
	console.log(log)
	fs.writeFile(process.env.LOG_FILE_PATH, JSON.stringify(log)+"\n", { flag: 'a+' }, err => {})
}

const logAPI = async(log)=> {
	//Log DB
	await dbutils.insert(Logs,log)

	let newLog = {timestamp: log.endDate,type:"",status:log.status,message: "HTTP Request: "+ log.method+" "+log.url,error: log.error,extra: log.extraLogs}
	if (log.error !== "") {
        newLog.type = "error";
    }else {
        newLog.type = "info";
    }

    //Log console
    console.log(newLog)

    //Log file
	fs.writeFile(process.env.LOG_FILE_PATH, JSON.stringify(newLog)+"\n", { flag: 'a+' }, err => {})
}

module.exports = {InitAPILogger,UpdateAPILogger,LogMessage}
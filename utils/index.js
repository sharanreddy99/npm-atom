// Imports
const logger = require("../logger");

const ServeResponse = async(req,res,status,data,err) => {
    let respData = {
        code: status,
        data: data,
        error: err
    }
    await logger.UpdateAPILogger(req,respData);
    res.status(status).send(respData);
}

module.exports = {ServeResponse}
// Built-In packages
const aws = require("aws-sdk");

// User Defined packages
const Emails = require("../../db/models/emails");
const dbutils = require("../../db/utils");

const sendEmail = (id)=>{
    const id = dbutils.findOne(Emails,id,select)
}

const findEmailByName = (id)=>{
    const id = dbutils
}
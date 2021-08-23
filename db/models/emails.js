const mongoose = require("..");

const emailSchema = new mongoose.Schema({
    emailName: {
        type: String,
        required: true,
    },
    emailType: {
        type: String,
        required: true,
        enum: ["OTP","MAIL"],
    },
    Destination: {
        type: Object,
        required: true,
        ToAddresses: {
            type: [String],
            required: true,
        },
        CCAddresses: {
            type: [String],
        },
        BCCAddresses: {
            type: [String],
        },
    },
    Source: {
        type: String,
        required: true,
    },
    htmlbody: {
        type: String,
    },
    textbody: {
        type: String,
    },
    attachments: [{
        type: String
    }],
    placeholders: {
        type: [String]
    },
})

const Emails = mongoose.model('Emails', emailSchema)
module.exports = Emails
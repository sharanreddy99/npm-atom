const mongoose = require("..");

const emailSchema = new mongoose.Schema({
  unqId: {
    type: String,
    required: true,
    unique: true,
  },
  emailName: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
    enum: ["TEXT", "HTML"],
  },
  htmlbody: {
    type: String,
  },
  textbody: {
    type: String,
  },
  placeholders: {
    type: [String],
  },
  row_status: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;

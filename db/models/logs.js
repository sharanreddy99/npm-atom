const mongoose = require("..");

const collectionName = process.env.NPM_ATOM_APP_NAME + "_logs";

const logsSchema = new mongoose.Schema({
  traceid: {
    type: String,
  },
  method: {
    type: String,
  },
  url: {
    type: String,
  },
  headers: {
    type: String,
  },
  params: {
    type: String,
  },
  status: {
    type: Object,
  },
  error: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  duration: {
    type: Number,
  },
  extraLogs: {
    type: Object,
  },
});

const Logs = mongoose.model(collectionName, logsSchema);
module.exports = Logs;

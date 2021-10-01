// Third Party Packages
const mongoose = require("mongoose");

// Setup
mongoose.connect(process.env.NPM_ATOM_DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

module.exports = mongoose;

// Custom Packages
require("dotenv").config();
const auth = require("./auth");
const constants = require("./constants");
const crypt = require("./crypt");
const db = require("./db");
const jwt = require("./jwt");
const logger = require("./logger");
const middleware = require("./middleware");
const redis = require("./redis");
const utils = require("./utils");
const email = require("./email");

const express = require("express");
const app = express();

app.use(express.json());
app.use(middleware.InitAPILoggerMiddleware);
app.use("/api/email", email);
app.use("/api/users", auth);

app.listen(4214, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("running npm-atom locally");
  }
});

module.exports = {
  auth,
  constants,
  crypt,
  db,
  jwt,
  logger,
  middleware,
  redis,
  utils,
  email,
};

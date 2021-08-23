// Third Party Packages
require("dotenv").config();
const express = require("express");

// Custom Packages
const middleware = require("./middleware");
const utils = require("./utils");
const logger = require("./logger");
const UserRouter = require("./auth");

// Setup
const app = express();

app.use(express.json());
app.use(middleware.InitAPILoggerMiddleware);
app.use("/api/users", UserRouter);

app.get("/", (req, res) => {
  utils.ServeResponse(req, res, 200, "Hello Sharan", "");
});

app.listen(4214, () => {
  console.log(`Example app listening at http://localhost:4214`);
});

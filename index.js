require('dotenv').config();
const express = require('express')
const app = express()

const middleware = require("./middleware")
const utils = require("./utils");
const logger = require("./logger");

app.use(middleware.InitAPILoggerMiddleware)

app.get('/', (req, res) => {
  utils.ServeResponse(req,res,200,"Hello Sharan","")
})

app.listen(4214, () => {  
  console.log(`Example app listening at http://localhost:4214`)
})
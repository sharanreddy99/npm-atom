// Third Party Packages
const jwt = require("jsonwebtoken");
const moment = require("moment");

// Custom Packages
const crypt = require("../crypt");
const constants = require("../constants");
const redis = require("../redis");
const logger = require("../logger");
const jwtutils = require("./utils");

const GenerateAccessToken = async (req, user) => {
  let payload = {
    iss: req.hostname,
    sub: "User",
    iat: moment.unix() / 1000,
    email: user.email,
    _id: user._id.toString(),
  };
  const token = jwt.sign(payload, process.env.CRYPTO_PASSPHRASE, {
    expiresIn: constants.JWT_TOKEN_EXPIRY,
  });

  const encToken = crypt.StringEncrypt(token);
  const key = jwtutils.GenerateAccessTokenRedisKey(req, user.email);
  await redis.SetDataWithExpiry(key, encToken, constants.JWT_TOKEN_EXPIRY);

  return encToken;
};

const VerifyAccessToken = async (encToken) => {
  try {
    let token = crypt.StringDecrypt(encToken);
    let decodedToken = await jwt.verify(token, process.env.CRYPTO_PASSPHRASE);
    return { _id: decodedToken._id, email: decodedToken.email, error: "" };
  } catch (e) {
    return { _id: "", email: "", error: "Unauthorized." };
  }
};

module.exports = { GenerateAccessToken, VerifyAccessToken };

// Custom Pacakges
const redis = require("../redis");

const GenerateAccessTokenRedisKey = (req, email) => {
  const extra = req.APILogger.extraLogs;
  const key = redis.GenerateKey(
    "access",
    email,
    extra.browser,
    extra.platform,
    extra.host,
    extra.ip
  );
  return key;
};

module.exports = { GenerateAccessTokenRedisKey };

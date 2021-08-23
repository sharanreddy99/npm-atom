const FetchIP = (req) => {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
};

module.exports = { FetchIP };

// Third Party Packages
const redis = require("redis");

// Custom Packages
const logger = require("../logger");
const constants = require("../constants");

// Setup
const client = redis.createClient(
  process.env.NPM_ATOM_REDIS_PORT,
  process.env.NPM_ATOM_REDIS_HOST
);

// Functions

// It fetches the data from the redis instance
const GetData = async (key) => {
  try {
    const response = await new Promise((resolve, reject) => {
      client.get(key, (err, res) => {
        if (err) {
          logger.LogMessage(
            req,
            constants.LOG_INFO,
            "[REDIS] Operation Failed -- GET " + key
          );
          reject(err);
        }
        logger.LogMessage(null, constants.LOG_INFO, "[REDIS] GET " + key);
        resolve(res);
      });
    });

    return response;
  } catch (e) {
    logger.LogMessage(null, constants.LOG_ERROR, "[REDIS] GET " + e.message);
    return null;
  }
};

// It deletes the key from the redis instance
const DeleteData = async (key) => {
  try {
    const response = await new Promise((resolve, reject) => {
      client.del(key, (err, res) => {
        if (err) {
          logger.LogMessage(
            null,
            constants.LOG_INFO,
            "[REDIS] Operation Failed -- DEL " + key
          );
          reject(err);
        }
        logger.LogMessage(null, constants.LOG_INFO, "[REDIS] DEL " + key);
        resolve(res);
      });
    });

    return response;
  } catch (e) {
    logger.LogMessage(null, constants.LOG_ERROR, "[REDIS] DEL " + e.message);
    return null;
  }
};

// It sets a key value pair in the redis instance
const SetData = async (key, data) => {
  try {
    const response = await new Promise((resolve, reject) => {
      client.set(key, data, (err, res) => {
        if (err) {
          logger.LogMessage(
            null,
            constants.LOG_INFO,
            "[REDIS] Operation Failed -- SET " + key
          );
          reject(err);
        }
        logger.LogMessage(null, constants.LOG_INFO, "[REDIS] SET " + key);
        resolve(res);
      });
    });
    return response;
  } catch (e) {
    logger.LogMessage(null, constants.LOG_ERROR, "[REDIS] SET " + e.message);
    return false;
  }
};

// It sets a key value pair for the specified duration in seconds
const SetDataWithExpiry = async (key, data, seconds) => {
  try {
    const response = await new Promise((resolve, reject) => {
      client.setex(key, seconds, data, (err, res) => {
        if (err) {
          logger.LogMessage(
            null,
            constants.LOG_INFO,
            "[REDIS] Operation Failed -- SETEXPIRY " + key
          );
          reject(err);
        }
        logger.LogMessage(null, constants.LOG_INFO, "[REDIS] SETEXPIRY " + key);
        resolve(res);
      });
    });
    return response;
  } catch (e) {
    logger.LogMessage(
      null,
      constants.LOG_ERROR,
      "[REDIS] SETEXPIRY " + e.message
    );
    return false;
  }
};

// It increments the value of key specified number of times  in the redis instance
const IncrementData = async (key, times = 1) => {
  try {
    const response = await new Promise((resolve, reject) => {
      client.incrby(key, times, (err, res) => {
        if (err) {
          logger.LogMessage(
            null,
            constants.LOG_INFO,
            "[REDIS] Operation Failed -- INCR " + key
          );
          reject(err);
        }
        logger.LogMessage(null, constants.LOG_INFO, "[REDIS] INCR " + key);
        resolve(res);
      });
    });
    return response;
  } catch (e) {
    logger.LogMessage(null, constants.LOG_ERROR, "[REDIS] INCR " + e.message);
    return false;
  }
};

// It increments the value of key specified number of times with the given expiration time in the redis instance
const IncrementDataWithExpiry = async (key, times = 1, expiry) => {
  try {
    const olddata = await GetData(key);
    if (olddata == null) {
      await SetDataWithExpiry(key, times, expiry);
    } else {
      const ttl = await GetTTL(key);
      await SetDataWithExpiry(key, parseInt(olddata) + times, ttl);
    }
    logger.LogMessage(null, constants.LOG_INFO, "[REDIS] INCR EXPIRY " + key);
    return true;
  } catch (e) {
    logger.LogMessage(
      null,
      constants.LOG_ERROR,
      "[REDIS] Operation Failed -- INCR EXPIRY " + key
    );
    return false;
  }
};

// It fetches the time to live value of a key in redis instance
const GetTTL = async (key) => {
  try {
    const response = await new Promise((resolve, reject) => {
      client.ttl(key, (err, res) => {
        if (err) {
          logger.LogMessage(
            null,
            constants.LOG_INFO,
            "[REDIS] Operation Failed -- GET TTL " + key
          );
          reject(err);
        }
        logger.LogMessage(null, constants.LOG_INFO, "[REDIS] GET TTL " + key);
        resolve(res);
      });
    });
    return parseInt(response);
  } catch (e) {
    logger.LogMessage(
      null,
      constants.LOG_ERROR,
      "[REDIS] GET TTL " + e.message
    );
    return 0;
  }
};

// It generates a key for storing data in redis instance.
const GenerateKey = (...args) => {
  key = "";
  for (i = 0; i < args.length; i++) {
    key += args[i] + "_";
  }
  return key;
};

module.exports = {
  client,
  GetData,
  SetData,
  DeleteData,
  SetDataWithExpiry,
  GenerateKey,
  IncrementData,
  IncrementDataWithExpiry,
  GetTTL,
};

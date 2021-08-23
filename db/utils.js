// Custom packages

const insert = async (collection, data) => {
  try {
    const collectionData = new collection(data);
    const resp = await collectionData.save();
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const find = async (collection, query = {}, select = null, options = null) => {
  try {
    const resp = await collection.find(query, select, options);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const findById = async (collection, id, select = null) => {
  try {
    const resp = await collection.findById(id, select);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const findOne = async (
  collection,
  query = {},
  select = null,
  options = null
) => {
  try {
    const resp = await collection.findOne(query, select, options);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateOne = async (
  collection,
  query = {},
  select = null,
  options = null
) => {
  try {
    const resp = await collection.updateOne(query, select, options);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateMany = async (
  collection,
  query = {},
  select = null,
  options = null
) => {
  try {
    const resp = await collection.updateMany(query, select, options);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteOne = async (collection, condition = {}, options = null) => {
  try {
    const resp = await collection.deleteOne(condition, options);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteMany = async (collection, condition = {}, options = null) => {
  try {
    const resp = await collection.updateMany(condition, options);
    return resp;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  find,
  findById,
  findOne,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  insert,
};

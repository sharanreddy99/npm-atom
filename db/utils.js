const insert = async(collection,data) => {
    const collectionData = new collection(data)
    const resp = await collectionData.save()
    return resp
}

const find = async(collection,query={},select=null,options=null) => {
    const resp = await collection.find(query,select,options)
    return resp
}

const findById = async(collection,id,select=null) => {
    const resp = await collection.findById(id,select)
    return resp
}

const findOne = async(collection,query={},select=null,options=null) => {
    const resp = await collection.findOne(query,select,options)
    return resp
}

const updateOne = async(collection,query={},select=null,options=null) => {
    const resp = await collection.updateOne(query,select,options)
    return resp
}

const updateMany = async(collection,query={},select=null,options=null) => {
    const resp = await collection.updateMany(query,select,options)
    return resp
}


const deleteOne = async(collection,condition={},options=null) => {
    const resp = await collection.deleteOne(condition,options)
    return resp
}

const deleteMany = async(collection,condition={},options=null) => {
    const resp = await collection.updateMany(condition,options)
    return resp
}

module.exports = {
    find, findById, findOne, updateOne, updateMany, deleteOne, deleteMany,insert
}
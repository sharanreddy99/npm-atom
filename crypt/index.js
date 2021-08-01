const crypto = require("crypto-js")
const algorithm = "aes-256-cbc";
const key = process.env.CRYPTO_PASSPHRASE;
const keyutf = crypto.enc.Utf8.parse(key);
const iv = crypto.enc.Base64.parse(key);

const StringEncrypt = (data) => {
    var encData = crypto.AES.encrypt(data,keyutf,{iv: iv}).toString();
    return encData
}

const StringDecrypt = (data) => {
    let decData = crypto.AES.decrypt(data,keyutf,{iv:iv}).toString(crypto.enc.Utf8);
    return decData
}

const ObjectEncrypt = (data) => {
    var encData = crypto.AES.encrypt(JSON.stringify(data),keyutf,{iv:iv}).toString();
    return encData
}

const ObjectDecrypt = (data) => {
    let bytes = crypto.AES.decrypt(data,keyutf,{iv:iv});
    let decData = JSON.parse(bytes.toString(crypto.enc.Utf8));
    return decData
}

const HashString = (data) => {
    let hash = crypto.SHA256(data).toString()
    return hash
}

const VerifyHashedString = (data,origHash) => {
    let hash = HashString(data)
    return hash === origHash
}

const HashObject = (data) => {
    return HashString(JSON.stringify(data))
}

const VerifyHashedObject = (data,origHash) => {
    return VerifyHashedString(JSON.stringify(data),origHash)
}

module.exports = {StringEncrypt,StringDecrypt,ObjectEncrypt,ObjectDecrypt,HashString,VerifyHashedString,HashObject,VerifyHashedObject}

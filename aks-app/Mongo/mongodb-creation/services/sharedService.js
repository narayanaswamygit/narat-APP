const CryptoJS = require("crypto-js");
const config = require("../config");
const secretPassphrase = CryptoJS.enc.Utf16.parse(config.secret_key);

module.exports.encrypt = (plainText) => {
    try {
        let encryptedCipher = CryptoJS.AES.encrypt(plainText, secretPassphrase, { mode: CryptoJS.mode.ECB });
        let encryptedCipherString = encryptedCipher.toString();
        return encryptedCipherString;
    } catch (error) {
        console.log("Error while Encrypting text:- " + plainText);
        console.log(error);
        return plainText;
    }
}

module.exports.decrypt = (cipherText) => {
    try {
        let decryptedCipher = CryptoJS.AES.decrypt(cipherText, secretPassphrase, { mode: CryptoJS.mode.ECB });
        let decryptedCipherString = decryptedCipher.toString(CryptoJS.enc.Utf8)
        return decryptedCipherString;

    } catch (error) {
        console.log("Error while Decrypting text:- " + cipherText);
        console.log(error);
        return cipherText;
    }
}

module.exports.decryptPayload = (encryptedBase64) => {
    try {
        let decryptedPayload = JSON.parse(Buffer.from(encryptedBase64, 'base64'))
        return decryptedPayload;
    } catch (error) {
        console.log("Error in decryptPayload method");
        console.log(error);
        return encryptedBase64;
    }
}

module.exports.encryptPayload = (payload) => {
    try {
        let encoded = Buffer.from(JSON.stringify(payload)).toString("base64");
        return encoded;
    } catch (error) {
        console.log("Error in encryptPayload method");
        console.log(error);
        return payload;
    }
}
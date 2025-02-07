const crypto = require('crypto');

function hmacSHA256(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

//let kDate = hmacSHA256(`AWS4${secretKey}`, dateStamp)
const cred = 
{
    key : "secretkeyvalue",
    dateStamp : "20250107"
}

console.log(hmacSHA256(cred))
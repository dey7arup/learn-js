const crypto = require('crypto');

function hmacSHA256(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

//Parameters List:
let dateStamp = '20250203'  //yyyyMMdd format
let region = 'me-central-1' //aws-region-name
let service = 's3'          //aws-service-name

let kDate = hmacSHA256(`AWS4$'secretKey'`, dateStamp);
let kRegion = hmacSHA256(kDate, region);
let kService = hmacSHA256(kRegion, service);
let kSigning = hmacSHA256(kService, 'aws4_request');

console.log(kDate);
console.log(kRegion);
console.log(kService);
console.log(kSigning);

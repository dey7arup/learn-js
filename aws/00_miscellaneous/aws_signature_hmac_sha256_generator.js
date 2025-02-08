const crypto = require('crypto');

function hmacSHA256(key, data) {
    return crypto.createHmac('sha256', key).update(data).digest();
}

function getSignatureKey(secretKey, dateStamp, region, service) {
    let kDate = hmacSHA256(`AWS4${secretKey}`, dateStamp);
    let kRegion = hmacSHA256(kDate, region);
    let kService = hmacSHA256(kRegion, service);
    let kSigning = hmacSHA256(kService, 'aws4_request');
    return kSigning;
}

function generateAWSSignature({ accessKey, secretKey, region, service, bucket, method, path, payload }) {
    const host = `${bucket}.s3.${region}.amazonaws.com`;
    const algorithm = "AWS4-HMAC-SHA256";
    const date = new Date();
    const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    
    // Canonical Request
    const canonicalURI = path;
    const canonicalQueryString = "";
    const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-date";

    const hashedPayload = crypto.createHash('sha256').update(payload || '').digest('hex');
    const canonicalRequest = `${method}\n${canonicalURI}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;

    // String to Sign
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;
    
    // Signing Key
    const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    // Authorization Header
    const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    
    return {
        'Authorization': authorizationHeader,
        'x-amz-date': amzDate,
        'host': host
    };
}

// Example Usage
const credentials = {
    accessKey: "YOUR_AWS_ACCESS_KEY",
    secretKey: "YOUR_AWS_SECRET_KEY",
    region: "us-east-1",
    service: "s3",
    bucket: "your-bucket-name",
    method: "PUT",
    path: "/your-object-key",
    payload: "Your file data"   //Null for GET Requests
};

console.log(generateAWSSignature(credentials));

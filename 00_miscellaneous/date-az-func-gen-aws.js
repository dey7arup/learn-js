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

function generateAWSSignature({ accessKey, secretKey, region, service, bucket, method, path, payload, date }) {
    try {
        const host = `${bucket}.s3.${region}.amazonaws.com`;
        const algorithm = "AWS4-HMAC-SHA256";
        const amzDate = date.replace(/[:-]|\.\d{3}/g, '');
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
    } catch (error) {
        throw new Error("Error generating AWS Signature: " + error.message);
    }
}

// Azure Function Handler
module.exports = async function (context, req) {
    context.log("AWS Signature Function Triggered.");

    try {
        // Extract values from HTTP Request
        const { accessKey, secretKey, region, service, bucket, method, path, payload, date } = req.body;

        // Validate required parameters
        if (!accessKey || !secretKey || !region || !service || !bucket || !method || !path || !date) {
            throw new Error("Missing required parameters.");
        }

        // Generate AWS Signature
        const signature = generateAWSSignature({ accessKey, secretKey, region, service, bucket, method, path, payload, date });

        // Success Response
        context.res = {
            status: 200,
            body: signature
        };

    } catch (error) {
        context.log.error("Internal Server Error:", error);

        // Error Response
        context.res = {
            status: 500,
            body: { error: "Internal Server Error", message: error.message }
        };
    }
};

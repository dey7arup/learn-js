const crypto = require('crypto');
const AWS = require('aws-sdk');

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

async function uploadToS3({ accessKey, secretKey, region, bucket, fileName, fileContent }) {
    const s3 = new AWS.S3({
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        region: region
    });

    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: fileContent
    };

    return s3.upload(params).promise();
}

// Azure Function Handler
module.exports = async function (context, req) {
    context.log("AWS S3 Upload Function Triggered.");

    try {
        // Extract values from HTTP Request
        const { accessKey, secretKey, region, bucket, fileName, fileContent } = req.body;

        // Validate required parameters
        if (!accessKey || !secretKey || !region || !bucket || !fileName || !fileContent) {
            throw new Error("Missing required parameters.");
        }

        // Upload file to S3
        const result = await uploadToS3({ accessKey, secretKey, region, bucket, fileName, fileContent });

        // Success Response
        context.res = {
            status: 200,
            body: { message: "File uploaded successfully", result }
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

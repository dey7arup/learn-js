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
    try {
        console.log("Initializing S3 Client...");
        const s3 = new AWS.S3({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: region
        });

        console.log("Preparing Upload Parameters...");
        const params = {
            Bucket: bucket,
            Key: fileName,
            Body: fileContent
        };

        console.log("Uploading file to S3...");
        const result = await s3.upload(params).promise();
        console.log("Upload Successful:", result);
        return result;
    } catch (error) {
        console.error("Error during S3 Upload:", error);
        throw new Error("S3 Upload Failed: " + error.message);
    }
}

// Azure Function Handler
module.exports = async function (context, req) {
    context.log("AWS S3 Upload Function Triggered.");

    try {
        context.log("Extracting request parameters...");
        const { accessKey, secretKey, region, bucket, fileName, fileContent } = req.body;

        // Validate required parameters
        if (!accessKey || !secretKey || !region || !bucket || !fileName || !fileContent) {
            throw new Error("Missing required parameters.");
        }

        context.log("Parameters validated successfully.");

        // Upload file to S3
        const result = await uploadToS3({ accessKey, secretKey, region, bucket, fileName, fileContent });

        context.log("File upload completed successfully.");

        // Success Response
        context.res = {
            status: 200,
            body: { message: "File uploaded successfully", result }
        };
    } catch (error) {
        context.log.error("Internal Server Error:", error);

        // Detailed error response
        context.res = {
            status: 500,
            body: { 
                error: "Internal Server Error", 
                message: error.message, 
                details: error.stack
            }
        };
    }
};

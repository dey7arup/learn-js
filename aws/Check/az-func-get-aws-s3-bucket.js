const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function getObjectURL(key) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

module.exports = async function (context, req) {
    try {
        const { fileKey } = req.query || req.body;
        if (!fileKey) {
            context.res = {
                status: 400,
                body: "File key is required"
            };
            return;
        }
        
        const url = await getObjectURL(fileKey);
        context.res = {
            status: 200,
            body: { url }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error generating presigned URL: ${error.message}`
        };
    }
};

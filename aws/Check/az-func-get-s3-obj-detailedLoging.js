const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function getObjectURL(region, accessKeyId, secretAccessKey, bucketName, key) {
    console.log("Initializing S3 client...");
    const s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
    
    console.log("Creating GetObjectCommand...");
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });
    
    console.log("Generating presigned URL...");
    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}

module.exports = async function (context, req) {
    try {
        console.log("Received request with body:", req.body);
        const { region, accessKeyId, secretAccessKey, bucketName, fileKey } = req.body;
        
        if (!region || !accessKeyId || !secretAccessKey || !bucketName || !fileKey) {
            console.error("Missing required parameters");
            context.res = {
                status: 400,
                body: "All parameters (region, accessKeyId, secretAccessKey, bucketName, fileKey) are required"
            };
            return;
        }
        
        console.log("Generating presigned URL for:", fileKey);
        const url = await getObjectURL(region, accessKeyId, secretAccessKey, bucketName, fileKey);
        
        console.log("Successfully generated URL:", url);
        context.res = {
            status: 200,
            body: { url }
        };
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        context.res = {
            status: 500,
            body: `Error generating presigned URL: ${error.message}`
        };
    }
};

const {S3Client,GetObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({                 //constant name must not be same as imported library
    region: "YOUR REGION",
    credentials: {
        accessKeyId:"YOUR ACCESS KEY",          //keep header names fixed as mentioned 
        secretAccessKey:"YOUR SECRET KEY"       //keep header names fixed as mentioned
    }
});

async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket:"YOUR BUCKET NAME",
        Key: key
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });   //Expires in Parameter to control : By default the time is very short
    return url;
};

async function init() {
    console.log('URL for Sample File:', await getObjectURL("YOUR FOLDER NAME/ YOUR FILE NAME"));
}

init();
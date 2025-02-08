const {S3Client,GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({                 //constant name must not be same as imported library
    region: "YOUR_REGION",
    credentials: {
        accessKeyId:"YOUR_ACCESS_KEY",          //keep header names fixed as mentioned 
        secretAccessKey:"YOUR_SECRET_KEY"       //keep header names fixed as mentioned
    }
});

async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket:"YOUR_BUCKET_NAME",
        Key: key
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 120 });   //Expires in Parameter to control : By default the time is very short
    return url;
};

async function putObjectURL(filename, contentType){
    const command = new PutObjectCommand({
        Bucket: "YOUR_BUCKET_NAME",
        Key: `YOUR_FOLDER_NAME/Test/${filename}`
    })
    const url = await getSignedUrl(s3Client,command);
    return url;
}

async function init() {
    //console.log('URL for Sample File:', await getObjectURL("YOUR FOLDER NAME/ YOUR FILE NAME"));

    console.log('URL for Uploading'
        ,await putObjectURL(`TestSample-${Date.now()}.txt`  //YOUR_FILE_NAME
        ,'text/csv' //YOUR_FILE_CONTENT_TYPE
));
}

init();
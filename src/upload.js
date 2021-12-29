require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require("fs");

const s3 = new AWS.S3({
    apiVersion: "2010-12-01",
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_FZ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FZ, 
});

const uploadMedia = (fileName, fileLocation) => {
    const fileContent = fs.readFileSync(fileLocation);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME_FZ,
        Key: `art/devnet/media/${fileName}.png`, 
        Body: fileContent
    };
    s3.upload(params, function(err, data) {
        console.log(err, data);
    });
};

const uploadMetadata = (fileName, fileLocation) => {
    const fileContent = fs.readFileSync(fileLocation);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME_FZ,
        Key: `art/devnet/metadata/${fileName}.json`, 
        Body: fileContent
    };
    s3.upload(params, function(err, data) {
        console.log(err, data);
    });
};

module.exports = { uploadMedia, uploadMetadata };



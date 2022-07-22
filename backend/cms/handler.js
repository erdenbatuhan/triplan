"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.upload = async (event) => {
  const owner = event.queryStringParameters.owner;
  const encodedImage = event.body.image;

  if (!owner || !encodedImage) {
    return {
      statusCode: 400,
      body: "Please provide the owner id as a query string and image in the request body!"
    };
  }

  const imagePath = `${process.env.CMS_STORAGE_BUCKET_DIRECTORY_IMG}/${owner}.png`;
  const uploadPromise = s3.upload({
    "Body": Buffer.from(encodedImage, "base64"),
    "Bucket": process.env.CMS_STORAGE_BUCKET_NAME,
    "Key": imagePath,
    "ContentType": "mime/png"
  }).promise();

  return await uploadPromise.then(() => ({
    statusCode: 200,
    body: `${process.env.CMS_STORAGE_BUCKET_URL}/${imagePath}`
  })).catch(err => ({
    statusCode: err.statusCode || 400,
    body: err.message || "Something went wrong when it should not have!"
  }));
};


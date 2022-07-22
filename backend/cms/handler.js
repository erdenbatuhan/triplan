"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.upload = async (event) => {
  const owner = event.queryStringParameters.owner;
  const encodedImage = JSON.parse(event.body).image;

  if (!owner || !encodedImage) {
    console.log(`An error occurred with the parameters!\nReceived:\n- Owner: ${owner}\n- Image: ${encodedImage}`);
    return {
      statusCode: 400,
      body: "Please provide the owner as a query string and the image in the request body!"
    };
  }

  console.log(`Uploading an image with length ${encodedImage.length} and assigning it to ${owner}..`);

  const imagePath = `${process.env.CMS_STORAGE_BUCKET_DIRECTORY_IMG}/${owner}.png`;
  const uploadPromise = s3.upload({
    "Body": Buffer.from(encodedImage, "base64"),
    "Bucket": process.env.CMS_STORAGE_BUCKET_NAME,
    "Key": imagePath,
    "ContentType": "mime/png"
  }).promise();

  return await uploadPromise.then(() => {
    console.log(`Successfully uploaded the image for ${owner}!`);
    return {
      statusCode: 200,
      body: `${process.env.CMS_STORAGE_BUCKET_URL}/${imagePath}`
    }
  }).catch(err => {
    console.log(`An error occurred while uploading the image for ${owner}!`);
    return {
      statusCode: err.statusCode || 400,
      body: err.message || "Something went wrong when it should not have!"
    }
  });
};


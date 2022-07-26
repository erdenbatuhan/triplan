"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const readRequestBody = (event) => {
  try {
    return JSON.parse(event.body);
  } catch {
    return event.body;
  }
}

module.exports.restore = async (event) => {
  const owner = event.owner || event.queryStringParameters.owner;
  const versionId = event.versionId || event.queryStringParameters.versionId;
  const extension = event.extension || event.queryStringParameters.extension || process.env.DEFAULT_EXTENSION;

  if (!owner || !versionId) {
    console.log(`An error occurred with the parameters!\nReceived:\n- owner: ${owner}\n- versionId: ${versionId}`);
    return { statusCode: 400, body: "Please provide the owner and the versionId as a query strings!" };
  }

  console.log(`Restoring the image (version=${versionId}) assigned to ${owner}..`);

  const path = `${process.env.CMS_STORAGE_BUCKET_DIRECTORY_IMG}/${owner}.${extension}`;
  const imageRestored = await s3.getObject({
    Bucket: process.env.CMS_STORAGE_BUCKET_NAME, 
    Key: path,
    VersionId: versionId
  }).promise().then(({ Body }) => Body.toString("base64"));

  return await this.upload({ owner, image: imageRestored, extension }).finally(() => {
    console.log(`Restore operation of the image (version=${versionId}) assigned to ${owner} has finished!`);
  })
};

module.exports.upload = async (event) => {
  const owner = event.owner || event.queryStringParameters.owner;
  const encodedImage = event.image || readRequestBody(event).image;
  const extension = event.extension || event.queryStringParameters.extension || process.env.DEFAULT_EXTENSION;

  if (!owner || !encodedImage) {
    console.log(`An error occurred with the parameters!\nReceived:\n- owner: ${owner}\n- image: ${encodedImage}`);
    return { statusCode: 400, body: "Please provide the owner as a query string and the image in the request body!" };
  }

  console.log(`Uploading an image with length ${encodedImage.length} and assigning it to ${owner}..`);

  const path = `${process.env.CMS_STORAGE_BUCKET_DIRECTORY_IMG}/${owner}.${extension}`;
  const uploadPromise = s3.upload({
    Body: Buffer.from(encodedImage, "base64"),
    Bucket: process.env.CMS_STORAGE_BUCKET_NAME,
    Key: path,
    ContentType: "mime/png"
  }).promise();

  return await uploadPromise.then(() => {
    console.log(`Successfully uploaded the image for ${owner}!`);
    return {
      statusCode: 200,
      body: `${process.env.CMS_STORAGE_BUCKET_URL}/${path}`
    }
  }).catch(err => {
    console.log(`An error occurred while uploading the image for ${owner}!`);
    return { statusCode: err.statusCode || 400, body: err.message || "Something went wrong when it should not have!" }
  });
};

module.exports.find = async (event) => {
  const owner = event.owner || event.queryStringParameters.owner;
  const extension = event.extension || event.queryStringParameters.extension || process.env.DEFAULT_EXTENSION;

  if (!owner) {
    console.log(`An error occurred with the parameters!\nReceived:\n- owner: ${owner}`);
    return { statusCode: 400, body: "Please provide the owner as a query string!" };
  }

  console.log(`Finding all versions of images assigned it to ${owner}..`);

  const path = `${process.env.CMS_STORAGE_BUCKET_DIRECTORY_IMG}/${owner}.${extension}`;
  const listObjectVersionsPromise = s3.listObjectVersions({
    Bucket: process.env.CMS_STORAGE_BUCKET_NAME, 
    Prefix: path
   }).promise();

  return await listObjectVersionsPromise.then(data => {
    console.log(`Successfully found all versions of images assigned it to ${owner}!`);

    const versions = data["Versions"];
    return {
      statusCode: versions.length > 0 ? 200 : 404,
      body: JSON.stringify(versions.map(({ VersionId }) => (
        `${process.env.CMS_STORAGE_BUCKET_URL}/${path}?versionId=${VersionId}`
      )))
    }
  }).catch(err => {
    console.log(`An error occurred while finding all versions of images assigned it to ${owner}!`);
    return { statusCode: err.statusCode || 400, body: err.message || "Something went wrong when it should not have!" }
  });
};


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: process.env.MY_AWS_REGION });

module.exports.importProductsFile = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const { name } = event.queryStringParameters;
    const bucketName = process.env.BUCKET_NAME;
    const key = `uploaded/${name}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      ContentType: "text/csv",
    };

    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    console.log(`Signed URL: ${url}`);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      },
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.error("Error generating signed URL", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

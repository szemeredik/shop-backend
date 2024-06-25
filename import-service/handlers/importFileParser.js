const {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const csv = require("csv-parser");

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqsClient = new SQSClient({ region: process.env.MY_AWS_REGION });
const queueUrl = process.env.SQS_QUEUE_URL;

const s3Client = new S3Client({ region: process.env.MY_AWS_REGION });

const importFileParser = async (event) => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = record.s3.object.key;

      const getObjectParams = {
        Bucket: bucket,
        Key: key,
      };

      const data = await s3Client.send(new GetObjectCommand(getObjectParams));
      const s3Stream = data.Body.pipe(csv({ separator: ";" }));

      s3Stream.on("data", async (data) => {
        console.log("Parsed data:", data);
        try {
          const sendMessageParams = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(data),
          };
          const sendResult = await sqsClient.send(
            new SendMessageCommand(sendMessageParams)
          );
          console.log("Message sent to SQS:", sendResult);
        } catch (error) {
          console.error("Failed to send message to SQS:", error);
        }
      });

      await new Promise((resolve, reject) => {
        s3Stream.on("end", async () => {
          console.log(`Processing complete, moving ${key} to 'parsed' folder.`);

          const copyParams = {
            Bucket: bucket,
            CopySource: `${bucket}/${key}`,
            Key: key.replace("uploaded", "parsed"),
          };
          await s3Client.send(new CopyObjectCommand(copyParams));

          const deleteParams = {
            Bucket: bucket,
            Key: key,
          };
          await s3Client.send(new DeleteObjectCommand(deleteParams));

          console.log(
            `Moved ${key} to parsed folder and deleted from uploaded`
          );
          resolve();
        });

        s3Stream.on("error", (error) => {
          console.error("Stream error:", error);
          reject(error);
        });
      });
    }
  } catch (error) {
    console.error("Error handling the file:", error);
    throw new Error("Failed to process file");
  }
};

module.exports = { importFileParser };

import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import csv from "csv-parser";

const s3Client = new S3Client({ region: process.env.MY_AWS_REGION });

export const importFileParser = async (event) => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = record.s3.object.key;

      const getObjectParams = {
        Bucket: bucket,
        Key: key,
      };

      const s3Stream = s3Client
        .send(new GetObjectCommand(getObjectParams))
        .Body.pipe(csv());

      s3Stream.on("data", (data) => {
        console.log("Parsed data:", data);
      });

      s3Stream.on("end", async () => {
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

        console.log(`Moved ${key} to parsed folder and deleted from uploaded`);
      });
    }
  } catch (error) {
    console.error("Error parsing file", error);
    throw new Error("Error parsing file");
  }
};

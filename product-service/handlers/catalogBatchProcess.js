const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const snsClient = new SNSClient({ region: "eu-central-1" });
const topicArn = process.env.SNS_TOPIC_ARN;
const ddbClient = new DynamoDBClient({ region: "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

module.exports.catalogBatchProcess = async (event) => {
  console.log("Processing SQS event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const productData = JSON.parse(record.body);

    const productParams = {
      TableName: PRODUCTS_TABLE,
      Item: {
        id: productData.id,
        title: productData.title,
        description: productData.description,
        price: productData.price,
      },
    };

    try {
      await docClient.send(new PutCommand(productParams));
      console.log(`Product created: ${productData.title}`);

      // Send notification via SNS
      await snsClient.send(
        new PublishCommand({
          TopicArn: topicArn,
          Message: `New product created: ${productData.title}`,
          Subject: "WebApp: New Product Created",
        })
      );
      console.log("Notification sent to SNS");
    } catch (err) {
      console.error("Error adding product to DynamoDB:", err);
      continue; // Skip current loop iteration on error
    }
  }

  console.log("All records processed.");
};

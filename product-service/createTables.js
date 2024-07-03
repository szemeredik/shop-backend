import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "eu-central-1",
});

async function createTable(
  tableName,
  keySchema,
  attributeDefinitions,
  billingMode
) {
  const params = {
    TableName: tableName,
    KeySchema: keySchema,
    AttributeDefinitions: attributeDefinitions,
    BillingMode: billingMode,
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log(`Table created successfully: ${tableName}`);
    console.log(data);
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

async function setupTables() {
  // Create the products table
  await createTable(
    "products",
    [{ AttributeName: "id", KeyType: "HASH" }], // Partition key
    [{ AttributeName: "id", AttributeType: "S" }],
    "PAY_PER_REQUEST"
  );

  // Create the stock table
  await createTable(
    "stock",
    [{ AttributeName: "product_id", KeyType: "HASH" }], // Partition key
    [{ AttributeName: "product_id", AttributeType: "S" }],
    "PAY_PER_REQUEST"
  );
}

setupTables();

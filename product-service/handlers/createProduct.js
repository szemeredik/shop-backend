const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const ddbClient = new DynamoDBClient({ region: "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCK_TABLE = process.env.STOCK_TABLE;

module.exports.createProduct = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const body = JSON.parse(event.body);

  // Validation
  if (!body.title || !body.description || !body.price || !body.count) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid product data" }),
    };
  }

  const productId = uuidv4();

  const productParams = {
    TableName: PRODUCTS_TABLE,
    Item: {
      id: productId,
      title: body.title,
      description: body.description,
      price: body.price,
    },
  };

  const stockParams = {
    TableName: STOCK_TABLE,
    Item: {
      product_id: productId,
      count: body.count,
    },
  };

  try {
    await docClient.send(new PutCommand(productParams));
    await docClient.send(new PutCommand(stockParams));
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Product created successfully" }),
    };
  } catch (err) {
    console.error("Error creating product:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const ddbClient = new DynamoDBClient({ region: "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCK_TABLE = process.env.STOCK_TABLE;

module.exports.getProductsById = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { productId } = event.pathParameters;
  const params = {
    TableName: PRODUCTS_TABLE,
    Key: { id: productId },
  };

  try {
    const { Item } = await docClient.send(new GetCommand(params));
    if (!Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,OPTIONS",
        },
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    const stockParams = {
      TableName: STOCK_TABLE,
      Key: { product_id: productId },
    };
    const stockResult = await docClient.send(new GetCommand(stockParams));
    const product = {
      id: Item.id,
      title: Item.title,
      description: Item.description,
      price: Item.price,
      count: stockResult.Item ? stockResult.Item.count : 0,
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },
      body: JSON.stringify(product),
    };
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

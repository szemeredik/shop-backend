const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCK_TABLE = process.env.STOCK_TABLE;

module.exports.getProductsList = async (event) => {
  try {
    const productsData = await dynamodb
      .scan({ TableName: PRODUCTS_TABLE })
      .promise();
    const products = productsData.Items;

    const stockData = await dynamodb.scan({ TableName: STOCK_TABLE }).promise();
    const stocks = stockData.Items;

    const mergedData = products.map((product) => {
      const stock = stocks.find((s) => s.product_id === product.id);
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        count: stock ? stock.count : 0,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },
      body: JSON.stringify(mergedData),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
module.exports.getProductsById = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: PRODUCTS_TABLE,
    Key: { id },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
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

    // Fetch stock details
    const stockParams = {
      TableName: STOCK_TABLE,
      Key: { product_id: id },
    };
    const stockResult = await dynamodb.get(stockParams).promise();
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
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

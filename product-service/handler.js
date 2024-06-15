const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const ddbClient = new DynamoDBClient({ region: "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCK_TABLE = process.env.STOCK_TABLE;

const getProductsList = async (event) => {
  try {
    const productsData = await docClient.send(
      new ScanCommand({ TableName: PRODUCTS_TABLE })
    );
    const products = productsData.Items;

    const stockData = await docClient.send(
      new ScanCommand({ TableName: STOCK_TABLE })
    );
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

const getProductsById = async (event) => {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

const createProduct = async (event) => {
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

module.exports = {
  getProductsList,
  getProductsById,
  createProduct,
};

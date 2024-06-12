//populateTables.js

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const productsData = require("./products");

AWS.config.update({
  region: "eu-central-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createProduct(product) {
  const productId = uuidv4(); // Generate a new UUID for each product
  const productData = {
    TableName: "products",
    Item: {
      id: productId,
      title: product.title,
      description: product.description,
      price: Math.floor(product.price * 100), // Convert to integer for price in cents
    },
  };

  await dynamodb.put(productData).promise();
  return productId; // Return the new UUID for linking with stock
}

async function addToStock(productId, count) {
  const stockData = {
    TableName: "stock",
    Item: {
      product_id: productId,
      count: count,
    },
  };

  await dynamodb.put(stockData).promise();
}

async function populateData() {
  for (const product of productsData) {
    const productId = await createProduct(product);
    await addToStock(productId, product.count);
  }
  console.log("Data populated successfully!");
}

populateData().catch(console.error);

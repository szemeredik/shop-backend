import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import productsData from "./products.js"; // Ensure this file exports the products data correctly.

const client = new DynamoDBClient({ region: "eu-central-1" });
const docClient = DynamoDBDocumentClient.from(client);

async function createProduct(product) {
  const productId = uuidv4(); // Generate a new UUID for each product
  const params = {
    TableName: "products",
    Item: {
      id: productId,
      title: product.title,
      description: product.description,
      price: Math.floor(product.price),
    },
  };

  await docClient.send(new PutCommand(params));
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

  await docClient.send(new PutCommand(stockData));
}

async function populateData() {
  for (const product of productsData) {
    const productId = await createProduct(product);
    await addToStock(productId, product.count);
  }
  console.log("Data populated successfully!");
}

populateData().catch(console.error);

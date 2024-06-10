"use strict";

const products = [
  {
    count: 5,
    description: "Short Product Description1 updated",
    id: "8567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 3.5,
    title: "ProductOne Updated",
  },
  {
    count: 10,
    description: "Short Product Description3 updated",
    id: "8567ec4b-b10c-48c5-9345-fc73c48a80a0",
    price: 12,
    title: "ProductNew Updated",
  },
  {
    count: 8,
    description: "Short Product Description2 updated",
    id: "8567ec4b-b10c-48c5-9345-fc73c48a80a2",
    price: 25,
    title: "ProductTop Updated",
  },
  {
    count: 14,
    description: "Short Product Description7 updated",
    id: "8567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 18,
    title: "ProductTitle Updated",
  },
  {
    count: 9,
    description: "Short Product Description2 updated",
    id: "8567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 28,
    title: "Product Updated",
  },
  {
    count: 11,
    description: "Short Product Description4 updated",
    id: "8567ec4b-b10c-48c5-9445-fc73348a80a1",
    price: 18,
    title: "ProductTest Updated",
  },
];

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
    },
    body: JSON.stringify(products),
  };
};

module.exports.getProductsById = async (event) => {
  const { id } = event.pathParameters;

  const product = products.find((p) => p.id === id);

  if (!product) {
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
};

"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

const epoch = () => Math.floor(new Date().getTime() / 1000);

module.exports.handler = async (event) => {
  const expireInSeconds = process.env.REQUEST_EXPIRY_AFTER_DAYS * 24 * 60 * 60;

  await dynamo.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        PathName: event.rawPath,
        OccurredAt: epoch(),
        ExpiresAt: epoch() + expireInSeconds,
        Request: JSON.stringify(event),
      },
    })
  );

  return {
    statusCode: 200,
    body: "{}",
    headers: {
      "Content-Type": "application/json",
    },
  };
};

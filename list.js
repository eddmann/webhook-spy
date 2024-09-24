"use strict";

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event) => {
  const results = await dynamo.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PathName = :pathName",
      ExpressionAttributeValues: { ":pathName": event.rawPath },
      ScanIndexForward: false,
    })
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: `
      <html>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/open-fonts@1.1.1/fonts/inter.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css">
        <title>Webhook Spy</title>
        <style>
          header { display: flex; }
          h1 { flex: 1; }
          .request { margin-bottom: 3em; }
        </style>
      </head>
      <body>
        <header>
          <h1>Webhook Spy</h1>
          <div>Path: ${event.rawPath}</div>
        </header>
        ${results.Items.map((result) => {
          const request = JSON.parse(result.Request);
          try {
            request.body = JSON.parse(request.body);
          } catch (e) {}

          return `
            <div class="request">
              <time datetime="${result.OccurredAt}"></time>
              <pre>${JSON.stringify(
                {
                  method: request.requestContext.http.method,
                  path: request.requestContext.http.path,
                  query: request.rawQueryString,
                  protocol: request.requestContext.http.protocol,
                  sourceIp: request.requestContext.http.sourceIp,
                  headers: request.headers,
                  body: request.body,
                },
                null,
                2
              )}</pre>
            </div>
          `;
        }).join("\n")}
        <script>
          [...document.getElementsByTagName('time')].forEach((time) => {
            time.innerHTML = new Date(time.getAttribute('datetime') * 1e3).toLocaleString();
          });
        </script>
      </body>
      </html>
    `,
  };
};

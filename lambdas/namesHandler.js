import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const allowedOrigins = [
  'https://tracker-566b8.firebaseapp.com',
  'https://tracker-566b8.web.app',
  'http://localhost:3000',
];

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;

  const requestOrigin = event.headers?.origin;
  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type,Event-User',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,DELETE',
    'Access-Control-Max-Age': '3600',
  };

  try {
    const requestHeaders = await event.headers;

    const eventUser = requestHeaders['event-user'];

    const tableName = 'names';

    switch (event.routeKey) {
      case 'DELETE /config/names/{id}':
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          }),
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case 'GET /config/names':
        body = await dynamo.send(
          new ScanCommand({
            TableName: 'names',
            ExpressionAttributeNames: {
              '#user': 'user',
            },
            ExpressionAttributeValues: {
              ':user': eventUser,
            },
            FilterExpression: '#user = :user',
          }),
        );
        body = body.Items;
        break;
      case 'PUT /config/names':
        // Handle insert and update
        const requestJSON = JSON.parse(event.body);
        const requestArray = Array.isArray(requestJSON)
          ? requestJSON
          : [requestJSON];

        for (const itemObj of requestArray) {
          const uuid = itemObj?.id;
          if (!uuid) {
            const id = crypto.randomUUID();
            const response = await dynamo.send(
              new PutCommand({
                TableName: tableName,
                Item: {
                  id,
                  user: eventUser,
                  name: itemObj.name,
                  sortOrder: '-1', // always stick on top
                },
              }),
            );
            body = `Created name ${itemObj.name} - ${id}`;
          } else {
            const key = {
              id: { S: uuid },
            };

            const updateExpression =
              'SET #sortOrder = :sortOrder, #name = :name';
            const expressionAttributeNames = {
              '#sortOrder': 'sortOrder',
              '#name': 'name',
            };
            const expressionAttributeValues = {
              ':sortOrder': { S: `${itemObj?.sortOrder}` },
              ':name': { S: `${itemObj?.name}` },
            };

            const updateItemInput = {
              TableName: tableName,
              Key: key,
              UpdateExpression: updateExpression,
              ExpressionAttributeNames: expressionAttributeNames,
              ExpressionAttributeValues: expressionAttributeValues,
              ReturnValues: 'ALL_NEW',
            };

            const command = new UpdateItemCommand(updateItemInput);
            await dynamo.send(command);
          }
        }
        break;
      case 'OPTIONS /config/names':
      case 'OPTIONS /config/names/{id}':
        body = {};
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body += err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};

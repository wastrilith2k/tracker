import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':
      'https://tracker-e928d.firebaseapp.com,https://tracker-e928d.firebaseapp.com/,http://localhost:3000,http://localhost:3000/',
    'Access-Control-Allow-Headers': 'Content-Type,Event-User',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,DELETE',
    'Access-Control-Max-Age': '3600',
  };

  try {
    const requestHeaders = await event.headers;

    const eventUser = requestHeaders['event-user'];

    const tableName = 'events';

    switch (event.routeKey) {
      case 'DELETE /config/events/{id}':
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
      case 'GET /config/events':
        body = await dynamo.send(
          new ScanCommand({
            TableName: tableName,
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
      case 'GET /config/events/{id}':
        const name = event.pathParameters.id;
        body = await dynamo.send(
          new ScanCommand({
            TableName: tableName,
            ExpressionAttributeNames: {
              '#user': 'user',
              '#name': 'name',
            },
            ExpressionAttributeValues: {
              ':user': eventUser,
              ':name': name,
            },
            FilterExpression: '#user = :user AND #name = :name',
          }),
        );
        body = body.Items;
        break;
      case 'PUT /config/events':
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
                  nameId: itemObj.nameId,
                  event: itemObj.event,
                  sortOrder: '-1', // always stick on top
                },
              }),
            );
            body = `Created event ${itemObj.event} - ${id}`;
          } else {
            const key = {
              id: { S: uuid },
            };

            const updateExpression =
              'SET #sortOrder = :sortOrder, #name = :name, #nameId = :nameId, #event = :event';
            const expressionAttributeNames = {
              '#sortOrder': 'sortOrder',
              '#name': 'name',
              '#nameId': 'nameId',
              '#event': ':event',
            };
            const expressionAttributeValues = {
              ':sortOrder': { S: `${itemObj?.sortOrder}` },
              ':name': { S: `${itemObj?.name}` },
              ':nameId': { S: `${itemObj?.nameId}` },
              ':event': { S: `${itemObj?.event}` },
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
      case 'OPTIONS /config/events':
      case 'OPTIONS /config/events/{id}':
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

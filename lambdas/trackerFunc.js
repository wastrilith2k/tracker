import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "tracker";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://tracker-566b8.firebaseapp.com,https://tracker-566b8.firebaseapp.com/,http://localhost:3000,http://localhost:3000/",
    "Access-Control-Allow-Headers": "Content-Type,Event-User",
    "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,DELETE",
    "Access-Control-Max-Age": "3600"
  };

  try {
    const requestHeaders = await event.headers;

    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
              user: eventUser
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /metrics/{name}":
        const eventUser = requestHeaders["event-user"];
        body = await dynamo.send(
          new ScanCommand({
            TableName: tableName,
            ExpressionAttributeNames: {
              '#user': 'user',
              '#name': 'name',
            },
            ExpressionAttributeValues: {
              ':name': event.pathParameters.name,
              ':user': eventUser,
            },
            FilterExpression: '#user = :user AND #name = :name',
          })
        );
        body = body.Items;
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        const uuid = crypto.randomUUID();
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              name: requestJSON.name,
              nameId: requestJSON.nameId,
              event: requestJSON.event,
              eventId: requestJSON.eventId,
              comment: requestJSON.comment,
              user: requestJSON.user,
              date: requestJSON.date,
              hour: requestJSON.hour,
              id: uuid
            },
          })
        );
        body = `Put item ${uuid} - ${requestJSON.name} ${requestJSON.event}`;
        break;
      case "OPTIONS /":
      case "OPTIONS /items":
      case "OPTIONS /items/{id}":
      case "OPTIONS /metrics/{name}":
        body = {};
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};

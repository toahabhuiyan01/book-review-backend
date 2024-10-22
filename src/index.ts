import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import makeApi from './api/make-api'
import routes from './routes'

export const api = makeApi('openapi.yaml', routes)
export const handler = (event: APIGatewayProxyEvent, context: Context) => api.handleRequest(
	{
		method: event.httpMethod,
		path: event.path,
		body: event.body,
		query: event.queryStringParameters as { [_: string]: string | string[] },
		headers: event.headers as { [_: string]: string | string[] },
	},
	event,
	context,
)
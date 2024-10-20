import { Boom } from "@hapi/boom";
import OpenAPIBackend, { Context } from "openapi-backend";
import { operations } from "../types/openapi";
import Pino, { Logger } from "pino"
import { Chance } from "chance";
import Express from 'express'
import { IJWT, validateAccessToken } from "./token-utils";
import mongoClient from './get-db-connection'
import * as dotenv from 'dotenv'

export type Operation = keyof operations
type FullOp<O extends Operation> = operations[O] & {
    parameters: {
        path: { }
        query: { }
    }
    requestBody: {
        content: {
            'application/json': { }
        }
    }
	responses: {
		'200': {
			content: {
				'application/json': {} | void
			}
		}
	}
}
export type FullRequest<O extends Operation> = FullOp<O>['parameters']['query'] & FullOp<O>['parameters']['path'] & FullOp<O>['requestBody']['content']['application/json']
export type Response<O extends Operation> = FullOp<O>['responses']['200']['content']['application/json']
export type Handler<O extends Operation> = (
	request: FullRequest<O>,
    util: { logger: Logger },
    user: IJWT
) => Promise<Response<O>>

export type APIResult = { statusCode: number, body: any }

const headers = {
	'content-type': 'application/json',
	'access-control-allow-origin': '*', // lazy cors config
}

export default function(
    openapiPath: string,
    routes: { [K in Operation]: Handler<K> }
) {
    const api = new OpenAPIBackend({
        definition: openapiPath
    })

    api.registerSecurityHandler('bearerAuth', (event) => {
        try {
            const [auth] = event.operation.security || []

            if(auth) {
                const headers = event.request.headers
                const token = (headers.Authorization || headers.authorization)?.slice(7)

                if(!token) {
                    throw new Boom('Unauthorized', { statusCode: 401 })
                }

                const user = validateAccessToken(token)
                console.log(auth, user)
                return user
            }
        } catch (error) {
            if(error instanceof Boom) {
				throw error
			} else {
                // @ts-ignore
				throw new Boom(error.message, { statusCode: 401 })
			}
        }
    })


    api.register({
        notFound: errorHandleWrapper(() => {
            throw new Boom('Not Found', { statusCode: 404 })
        }),
        // @ts-ignore
        validationFail: errorHandleWrapper(() => {}),
        ...Object.keys(routes).reduce((acc, key: Operation) => ({
            ...acc,
            [key]: errorHandleWrapper(routes[key])
        }), {})
    })

    return api
}


function errorHandleWrapper(handler: Handler<Operation>) {
    return async (context: Context, req: Express.Request, res: Express.Response) => {
        const chance = new Chance()
        const result = {} as APIResult
        let logger = Pino().child({ requestId: chance.guid() })

        const query = context.request.query || {}
        const body = context.request.body || {}
        const params = context.request.params || {}

        const fullRequest = {
            ...query,
            ...body,
            ...params
        } as FullRequest<Operation>

        try {
            if(context.validation.errors) {
                throw new Boom('Invalid Request', { statusCode: 400, data: context.validation.errors })
            }
            dotenv.config()
            await mongoClient()
            result.body = await handler(
                fullRequest,
                { logger },
                context.security?.bearerAuth
            )
            result.statusCode = 200
        } catch(error) {
            let errorDescription: string
			let data
			if(error instanceof Boom) {
				errorDescription = error.message
				data = error.data
				result.statusCode = error.output.statusCode
			} else {
				errorDescription = 'Internal Server Error'
				result.statusCode = 500
			}

			result.body = {
				error: errorDescription,
				statusCode: result.statusCode,
				message: error.message,
				data
			}
        }

        logger.info(
            {
                path: `${context.request.method} ${context.request.path}`,
                response: result.body,
                request: fullRequest,
                statusCode: result.statusCode
            },
            'Request Complete'
        )

        res.status(result.statusCode).send(result.body)
    }
}
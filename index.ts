import Express from 'express'
import makeApi from './src/api/make-api'
import routes from './src/routes'
import Cors from 'cors'
import { urlencoded, json } from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()

// here we are using express, we can use any backend framework

const app = Express()
app.use(Express.json())

const api = makeApi('openapi.yaml', routes)

app.use(Cors())
app.use(json({ limit: '10mb' }))
app.use(urlencoded({ limit: '10mb', extended: true, parameterLimit: 10000 }))
app.use(
	(req, res) => {
		api.handleRequest(
			{
				method: req.method,
				path: req.path,
				body: req.body,
				query: req.query as {[key: string]: string | string[]},
				headers: req.headers as {[key: string]: string | string[]},
			},
			req,
			res
		)
	}
)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log('Listening on 9090')
})

export default app
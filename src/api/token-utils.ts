import { Boom } from '@hapi/boom'
import keys from '../keys.json'
import { sign as signJWT, verify as verifyJWT, VerifyOptions } from 'jsonwebtoken'

const JWT_ALG = 'RS256'
// the keys are attached with the headers in code
// this is because storing new lines in GH actions secrets causes weird issues
const PRIVATE_KEY = keys.private_key
const PUBLIC_KEY = keys.public_key

export const TOKEN_EXPIRY = 60 * 24 * 1000

export type GenerateJWTOptions = {
    user: {
        id: string
        username: string
        email: string
    }
	expirationMinutes?: number
}

export type IJWT = {
	/** Binary representation of the scope array */
	// scope: string
	exp: number
	iat: number
	user: {
		id: string
		username: string
		email: string
	}
}

export const generateAccessToken = (opts: GenerateJWTOptions) => {
	const jwt = generateJwt(opts)
	const token = signJWT(jwt, PRIVATE_KEY, { algorithm: JWT_ALG })
	return token
}

export function generateJwt({
	user,
	expirationMinutes = TOKEN_EXPIRY
}: GenerateJWTOptions) {
	const iat = Math.floor(Date.now() / 1000)
	const exp = iat + (expirationMinutes * 60)
	const jwt: IJWT = {
        user,
		iat,
		exp
	}
	return jwt
}

export const validateAccessToken = (token: string, opts?: VerifyOptions) => {
	try {
		const user = verifyJWT(token, PUBLIC_KEY, {
			algorithms: [ JWT_ALG ],
			...(opts || {})
		}) as IJWT
		return user
	} catch(error) {
		throw new Boom(error.message, { statusCode: 401 })
	}
}
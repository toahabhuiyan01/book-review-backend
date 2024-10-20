import { compare, hash } from 'bcryptjs'

const HASH_SALT_ROUND = 10

export const passwordHash = async(pass: string) => {
	const result = await hash(pass, HASH_SALT_ROUND)
	return result
}

export const passwordCheckMatch = async(bcrypt: string, pass: string) => {
	try {
		const result = await compare(pass, bcrypt)
		return result
	} catch(error) {
		return false
	}
}
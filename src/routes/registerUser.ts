import { Boom } from "@hapi/boom"
import { Handler } from "../api/make-api"
import User from "../entity/User"
import { passwordHash } from "../utils/encodePass"

// the "Handler" type automatically does type checks for the response as well
const handler: Handler<'registerUser'> = async (
    req,
) => {
    const existingUser = await User.findOne({ email: req.email })

    if (existingUser) {
        throw new Boom('User already exists', { statusCode: 400 })
    }

    const newUser = new User({
        username: req.username,
        email: req.email,
        password: await passwordHash(req.password),
    })

    await newUser.save()

    return { success: true }
}


export default handler
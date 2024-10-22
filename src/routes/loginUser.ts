import { Boom } from "@hapi/boom";
import { Handler } from "../api/make-api";
import User from "../entity/User";
import { generateAccessToken } from "../api/token-utils";
import { passwordCheckMatch } from "../utils/encodePass";

const handler: Handler<'loginUser'> = async(
    req
) => {
        const userDB = await User.findOne({ email: req.email })

        if (!userDB) {
            throw new Boom('User not found', { statusCode: 404 })
        }

        const validPassword = await passwordCheckMatch(userDB.password, req.password)
        if (!validPassword) {
            throw new Boom('Email or password is not correct', { statusCode: 401 })
        }


    const response = {
        accessToken: generateAccessToken({
            user: {
                id: userDB._id,
                email: userDB.email,
                username: userDB.username
            }
        }),
    }


    return response
}

export default handler
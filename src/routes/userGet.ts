import { Boom } from "@hapi/boom";
import { Handler } from "../api/make-api";
import User from "../entity/User";


const handler: Handler<'userGet'> = async(
    { },
    { },
    { user }
) => {
    const userDB = await User.findOne({ email: user.email }, { password: 0, __v: 0 })

    if (!userDB) {
        throw new Boom('User not found', { statusCode: 404 })
    }

    const { _id: id, ...rest } = userDB

    return { ...rest._doc, id }
}

export default handler
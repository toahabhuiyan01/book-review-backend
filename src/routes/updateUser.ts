import { Handler } from "../api/make-api";
import User from "../entity/User";
import { cleanObject } from "../utils/cleanObject";

const handler: Handler<'userPatch'> = async(
    req
) => {
    const cleanedObj = cleanObject(req)

    await User.findOneAndUpdate(
        { email: req.email },
        { ...cleanedObj }
    )

    return { success: true }
}

export default handler
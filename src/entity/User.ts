import Moongose, { Schema } from "mongoose";

export const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: {
            type: String,
            required: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
                'Please enter a valid email address' // Custom error message for invalid email
            ]
        },
        createdAt: { type: Date, default: Date.now },
        password: { type: String, required: true },
        avatar: { type: String, required: false }
    },
    { collection: 'book_review_users'}
)

const User = Moongose.models.User || Moongose.model('User', userSchema)
export default User
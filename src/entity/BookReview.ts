import { Boom } from "@hapi/boom"
import Mongoose, { Schema, model, models } from "mongoose"


// Review schema definition
const reviewSchema = new Schema(
    {
        bookTitle: {
            type: String,
            required: true,
            trim: true
        },
        bookAuthor: {
            type: String,
            required: true,
            trim: true
        },
        reviewer: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5 // Rating out of 5
        },
        reviewText: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'book_review_reviews' }
)

reviewSchema.pre('save', async function (next) {
    const userExists = await model('User').exists({ _id: this.reviewer })
    if (!userExists) {
        throw new Boom('User does not exist', { statusCode: 400 })
    }
    next()
})

const Review = models.Review || model('Review', reviewSchema)

export default Review

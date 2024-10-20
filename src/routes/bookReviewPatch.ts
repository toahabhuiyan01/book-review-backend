import { Handler } from "../api/make-api";
import Review from "../entity/BookReview";
import { cleanObject } from "../utils/cleanObject";

const handler: Handler<'bookReviewPatch'> = async(
    { reviewId, rating, reviewText },
    {},
    { user: { id } }
) => {
    const cleanedObj = cleanObject({ rating, reviewText })

    if (Object.keys(cleanedObj).length) {
        await Review.findOneAndUpdate(
            { _id: reviewId, reviewer: id },
            { ...cleanedObj }
        )
    }
        
    return { success: true }
}

export default handler
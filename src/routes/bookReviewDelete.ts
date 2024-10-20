import { Handler } from "../api/make-api";
import Review from "../entity/BookReview";

const handler: Handler<'bookReviewDelete'> = async(
    { reviewId }
) => {
    await Review.deleteOne({ _id: reviewId })

    return { success: true }
}

export default handler
import { Handler } from "../api/make-api";
import Review from "../entity/BookReview";

const handler: Handler<'bookReviewGet'> = async(
    { page=1, id, limit=20 }
) => {
    const skip = (page - 1) * limit

    const reviews = await Review
        .find({ user: id })
        .populate('reviewer', 'username email avatar')
        .skip(skip)
        .limit(limit)
        .exec()
    
    const total = await Review.countDocuments({ user: id })

    return {
        reviews,
        total,
        currentPage: page
    }
}

export default handler
import { Handler } from "../api/make-api";
import Review from "../entity/BookReview";
import { cleanObject } from "../utils/cleanObject";

const handler: Handler<'bookReviewGet'> = async(
    { page=1, id, limit=20 }
) => {
    page = +page
    limit = +limit
    const skip = (page - 1) * limit

    const reviews = await Review
        .find(cleanObject({ reviewer: id }), { __v: 0 }, { sort: { createdAt: -1 } })
        .populate('reviewer', 'username email avatar')
        .skip(skip)
        .limit(limit)
        .exec()
    
    const total = await Review.countDocuments({ user: id })

    return {
        reviews: reviews.map((review) => ({ id: review.id, ...review._doc })),
        total,
        currentPage: page
    }
}

export default handler
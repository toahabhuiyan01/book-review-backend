import { Handler } from "../api/make-api";
import Review from "../entity/BookReview";

const handler: Handler<'bookReviewPost'> = async(
    { bookAuthor, bookTitle, reviewText, rating },
    { logger },
    { user: { id } }
) => {
    const review = new Review({
        bookAuthor,
        bookTitle,
        reviewText,
        rating,
        reviewer: id
    })

    const reviewCreated = await review.save()
    
    return {
        review: reviewCreated
    }
}

export default handler
import registerUser from './registerUser'
import loginUser from './loginUser'
import userPatch from './updateUser'
import bookReviewDelete from './bookReviewDelete'
import bookReviewPatch from './bookReviewPatch'
import bookReviewPost from './bookReviewPost'
import bookReviewGet from './bookReviewGet'

const routes = {
    registerUser,
    loginUser,
    userPatch,
    bookReviewGet,
    bookReviewDelete,
    bookReviewPatch,
    bookReviewPost
}

export default routes
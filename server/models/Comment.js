const mongoose = require('mongoose')
const Schema = mongoose.Schema

//구독자 정보를 다 보관하는 테이블
//userTO : 구독하는 대상
//userFrom : 구독하는 사람
const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }

}, { timestamps: true })


const Comment = mongoose.model('Comment', commentSchema)

module.exports = { Comment }
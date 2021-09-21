const mongoose = require('mongoose')
const Schema = mongoose.Schema


const videoSchema = mongoose.Schema({

    writer: {
        type: Schema.Types.ObjectId,      //이렇게 불러오면 User모델의 해당 정보를 모두 긁어 올 수 있다.
        ref: 'User'                         //User모델을 리퍼런스
    },
    title: {
        type:String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }

}, { timestamps: true })


const Video = mongoose.model('Video', videoSchema)

module.exports = { Video }
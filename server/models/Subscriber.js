const mongoose = require('mongoose')
const Schema = mongoose.Schema

//구독자 정보를 다 보관하는 테이블
//userTO : 구독하는 대상
//userFrom : 구독하는 사람
const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })


const Subscriber = mongoose.model('Subscriber', subscriberSchema)

module.exports = { Subscriber }
const express = require('express');
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");


//=================================
//             Subscribe
//=================================

//구독자 정보를 가져와서 갯수를 리턴
router.post('/subscribeNumber', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
    })

})

//나의 구독 정보를 가져와서 T/F를 리턴
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err)
        let result = false
        if(subscribe.length !== 0){     //나의 구독 정보가 있을 때
            result = true
        }
        return res.status(200).json({ success: true, subscribed: result })
    })

})

//구독 취소 처리
router.post('/unSubscribe', (req, res) => {

    Subscriber.findOneAndDelete({userTo:req.body.userTo, userFrom:req.body.userFrom})
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success: true, doc })
    })

})

//구독 처리
router.post('/subscribe', (req, res) => {
    const subscriber = new Subscriber(req.body)
    subscriber.save((err, doc) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success: true, doc })
    })


})

module.exports = router;

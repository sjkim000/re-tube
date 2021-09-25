const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment");


//=================================
//             Comment
//=================================

//코맨트를 받아와서 DB에 저장
router.post('/saveComment', (req, res) => {
    // console.log('here')
    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if(err) return res.json({ success: false, err})
        Comment.find({'_id': comment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({ success: false, err})
            res.status(200).json({ success: true, result })
        })
    })

})

//코맨트정보를 클라이언트측에 전달
router.post('/getComments', (req, res) => {
    Comment.find({'videoId': req.body.videoId})
    .populate('writer')
    .exec((err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, comments })
    })

})

module.exports = router;

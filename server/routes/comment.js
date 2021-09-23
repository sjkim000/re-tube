const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment");


//=================================
//             Comment
//=================================

//구독자 정보를 가져와서 갯수를 리턴
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


module.exports = router;

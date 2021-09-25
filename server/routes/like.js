const express = require('express');
const router = express.Router();

const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");


//=================================
//             Like
//=================================

//좋아요 정보를 클라이언트측에 전달
router.post('/getLikes', (req, res) => {
    
    let variable = {}
    if(req.body.videoId) {
        // console.log('video : ', req.body.videoId)
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        // console.log('comment : ', req.body.commentId)
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    
    Like.find(variable)
    .exec((err, likes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, likes })
    })

})

//싫어요 정보를 클라이언트측에 전달
router.post('/getDislikes', (req, res) => {
    
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    
    Dislike.find(variable)
    .exec((err, dislikes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, dislikes })
    })

})

//좋아요 정보를 카운트업, 내 싫어요가 있다면 삭제
router.post('/upLike', (req, res) => {
    
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    
    //Like 콜랙션에 정보를 업데이트
    const like = new Like(variable)
    like.save((err, likeResult) => {
        if(err) return res.json({ success: false, err })
        
        //나의 싫어요가 클릭되어 있다면 그것을 제거
        Dislike.findOneAndDelete(variable)
        .exec((err, disLikeResult) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
    })
})

//좋아요 정보를 다운카운트
router.post('/unlike', (req, res) => {
    
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    
     Like.findOneAndDelete(variable)
     .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

//싫어요 정보를 다운카운트
router.post('/undislike', (req, res) => {
    
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

//싫어요 정보를 카운트업, 내 좋아요가 있다면 삭제
router.post('/upDislike', (req, res) => {
    
    let variable = {}
    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }
    
    //Like 콜랙션에 정보를 업데이트
    const dislike = new Dislike(variable)
    dislike.save((err, dislikeResult) => {
        if(err) return res.json({ success: false, err })
        
        //나의 싫어요가 클릭되어 있다면 그것을 제거
        Like.findOneAndDelete(variable)
        .exec((err, likeResult) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
    })
})

module.exports = router;

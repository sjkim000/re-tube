const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), flase)
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single('file')

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    //클라이언트에서 받은 비디오를 저장한다.
    upload(req, res, err => {           //err => 인자가 1개이면 괄호 생략 가능
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename　})
    })
})

router.post('/uploadVideo', (req, res) => {
    //비디오 정보들을 DB에 저장한다.
    const video = new Video(req.body)           
    video.save((err, doc) => {          //몽고DB에 저장
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.get('/getVideos', (req, res) => {
    //비디오 정보를 DB에서 가져와서 클라이언트에 제공
    Video.find()
    .populate('writer')         //user정보를 참조하여 검색해 온다
    .exec((err, videos) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, videos})
    })
})

router.post('/getVideoDetail', (req, res) => {
    //단일 비디오 정보를 DB에서 가져와서 클라이언트에 제공 body를 참조하므로 post형식
    Video.findOne({ '_id': req.body.videoId })
    .populate('writer')         //user정보를 참조하여 검색해 온다
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, videoDetail })
    })
})

router.post('/thumbnail', (req, res) => {
    //썸네일 생성하고 비디오 러닝타임 취득

    let filePath = ''
    let fileDuration = ''

    //비디오 정보 취득
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata)
        console.log(metadata.format.duration)
        fileDuration = metadata.format.duration
    })

    //썸네일 생성부분
    ffmpeg(req.body.url)
    .on('filenames', function(filenames) {      //처리부분
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)
        
        filePath = 'uploads/thumbnails/' + filenames[0]
    })
    .on('end', function () {    //처리가 성공적으로 끝나면
        console.log('Screenshots taken')
        return res.json({ success: true, url: filePath, fileDuration: fileDuration })
    })
    .on('error', function (err) {   //에러가 나면
        console.errlr(err)
        return res.json({ success: false, err })
    })
    .screenshots({      //옵션설정
        // Will take screenshots at 20%, 40%, 60%, and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        //'%b': input basename(filename w/o extension)
        filename: 'thumbnail-%b.png'
    })

})

module.exports = router;

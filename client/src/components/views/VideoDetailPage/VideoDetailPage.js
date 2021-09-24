import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar  } from 'antd'
import Axios from 'axios'
import SideVideo from './Section/SideVideo'
import Subscribe from './Section/Subscribe'
import Comment from './Section/Comment'

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId      //App.js에서 경로에 "/video/:videoId"을 넣었기 때문에 가져올 수 있다.
    const videoInfo = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', videoInfo)      //body를 전송하므로 POST형식
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail)
            } else {
                alert('비디오 정보를 가져올 수 없습니다.')
            }
        })

        Axios.post('/api/comment/getComments', videoInfo)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.comments)
            } else {
                alert('코멘트 정보를 가져올 수 없습니다.')
            }
        })

    }, [])

    const refreshFunction = (newComment) => {           //새로 추가된 코멘트를 가져와서 추가
        setComments(Comments.concat(newComment))
        console.log('refreshFunction!')
    }

    if (VideoDetail.writer) {
        //let a = true && 'test'  //를 하면 a에는 test가 들어감. false의 경우에는 a에 false가 들어감 
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} /> 

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item
                            actions={[subscribeButton]}       //컴포넌트는 Subscribe.js에 정의
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}  //모델에서 populate을 했기 때문에 writer정보를 모두 가지고 있다 
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
    
                        {/* 코맨트 입력란 */}
                        <Comment refreshFunction ={refreshFunction} commentLists={Comments} postId={videoId}/>
    
                    </div>
                </Col>
                <Col lg={6} xs={24} >
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>... Loading</div>
        )
    }
}

export default VideoDetailPage

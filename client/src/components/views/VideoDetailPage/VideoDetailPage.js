import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar  } from 'antd'
import Axios from 'axios'
import SideVideo from './Section/SideVideo'
import Subscribe from './Section/Subscribe'

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId      //App.js에서 경로에 "/video/:videoId"을 넣었기 때문에 가져올 수 있다.
    const videoInfo = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', videoInfo)      //body를 전송하므로 POST형식
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail)
            } else {
                alert('비디오 정보를 가져올 수 없습니다.')
            }
        })
    }, [])
    if (VideoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item
                            actions={[<Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />]}       //컴포넌트는 Subscribe.js에 정의
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}  //모델에서 populate을 했기 때문에 writer정보를 모두 가지고 있다 
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
    
                        {/* 코맨트 입력란 */}
    
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

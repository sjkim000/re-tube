import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function SideVideo() {

    const [SideVideos, setSideVideos] = useState([])      //state개설

    useEffect(() => {       //DOM이 로드되면 실행된다
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                // console.log(response.data)
                setSideVideos(response.data.videos)      //state에 저장
            } else {
                alert('비디오 가져오기를 실패했습니다.')
            }
        })
    }, [])                  //[]이 비어있으면 한 번만 실행

    const renderSideVideo = SideVideos.map((video, index) => {

        let minutes = Math.floor(video.duration / 60)
        let seconds = Math.floor(video.duration - minutes * 60)
        return <div key={index} style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}>
            <div style={{ width: "40%", marginRight: "1rem" }}>
                <a href >
                    <img style={{ width:"100%", height:"100%" }} src={`http://localhost:5000/${video.thumbnail}`} alt="Thumbnail" />
                </a>
            </div>
            <div style={{ width:"50%" }}>
                <a href style={{ color: "gray"}}>
                    <span style={{ fontSize: "1rem", color:"black" }}> {video.title}</span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views</span><br />
                    <span>{('00' + minutes).slice(-2)} : {('00' + seconds).slice(-2)}</span>
                </a>
            </div>
        </div>

    })

    return (
        <React.Fragment>
            <div style={{ marginTop: "3rem"}} />
            {renderSideVideo}
        </React.Fragment>



    )
}

export default SideVideo

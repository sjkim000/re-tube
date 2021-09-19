import React, { useState } from 'react'
import { Typography, Button, Form, Message, Input, Icon, message } from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import { response } from 'express'

const { TextArea } = Input
const { Title } = Typography
const PrivateOptions = [
    {value: 0, label: 'Private'},
    {value: 1, label: 'Public'}
]
const CategoryOptions = [
    {value: 0, label: 'Film & Animation'},
    {value: 1, label: 'Autos & Vehicles'},
    {value: 2, label: 'Music'},
    {value: 3, label: 'Pets & Animals'}
]

function VideoUploadPage() {
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState('Film & Animation')
    const [FilePath, setFilePath] = useState('')
    const [Duration, setDuration] = useState('')
    const [ThumbnailPath, setThumbnailPath] = useState('')

    //인풋 이벤트 처리
    //입력할 때 마다 처리
    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value)
    }
    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value)
    }
    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value)
    }
    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value)
    }
    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0])

        Axios.post('/api/video/uploadfiles', formData, config).then(response => {
            if(response.data.success) {
                console.log(response.data)
                let fileInfo = {
                    url: response.data.url,
                    fileName: response.data.fileName
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', fileInfo).then(response => {
                    if(response.data.success) {
                        //썸네일 생성 성공 후
                        console.log(response.data)
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    } else {
                        alert('썸네일 생성에 실패했습니다.')
                    }
                })
            } else {
                alert('동영상 업로드에 실패했습니다.')
            }
        })

    }

    const onSubmit = (event) => {
        event.preventDefault();

        const fileInfo = {
            writer: user.userData._id,          //Redux의 State정보로 받아옴
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail:ThumbnailPath
        }
        Axios.post('/api/video/uploadVideo', fileInfo)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.success)
            } else {
                alert('비디오 업로드에 실패했습니다.')
            }
        })
    }

    return (
        <div style ={{ maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone */}
                    <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem'}} />
                            </div>    
                        )}
                    </Dropzone>
                    {/* Thumbnail */}
                    {ThumbnailPath &&       //ThumbnailPath값이 있을때 에만 아래가 랜더링 된다.
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage

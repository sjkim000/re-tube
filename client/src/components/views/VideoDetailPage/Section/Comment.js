import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Comment(props) {
    // console.log(props)
    const user = useSelector(state => state.user)
    const [CommentValue, setCommentValue] = useState('')
    const videoId = props.postId
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();     //버튼을 눌렀을 때 화면 리플래시를 안하도록 해준다.

        const postInfo = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId
        }
        Axios.post('/api/comment/saveComment', postInfo)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.result)
            } else {
                alert('커멘트를 보존 중 문제가 발생했습니다.')
            }
        })

    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/* Comment Lists */}

            {/* Root Comment Form */}

            <from style={{ display: 'flex'}} onSubmit >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder="코멘트를 작성해 주세요."
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </from>

        </div>
    )
}

export default Comment

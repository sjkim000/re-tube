import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import { useSelector } from 'react-redux'
import Axios from 'axios'

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false)       //초기 대댓글창은 안보이도록
    const [CommentValue, setCommentValue] = useState('')
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)                            //대댓글 버튼이 눌리면 값을 토글
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        const postInfo = {
            content: CommentValue,
            writer: user.userData._id,
            videoId: props.videoId,
            responseTo: props.comment._id
        }
        Axios.post('/api/comment/saveComment', postInfo)
        .then(response => {
            if(response.data.success) {
                // console.log(response.data.result)
                setCommentValue('')     //코멘트 입력란을 비운다
                setOpenReply(false)
                props.refreshFunction(response.data.result)    //부모로부터 props을 통해 받아온 펑션을 통해 정보를 넘김
                // console.log(postInfo)

            } else {
                alert('커멘트를 보존 중 문제가 발생했습니다.')
            }
        })

    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={ <p> {props.comment.content}</p>}
            />

            {OpenReply &&       //OpenReplay값에 따라 대댓글 창 표시 유무를 결정
                <from style={{ display: 'flex'}} onSubmit={onSubmit} >
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요."
                        />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
                </from>
            }

        </div>
    )
}

export default SingleComment

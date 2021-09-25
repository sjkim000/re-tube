import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'
function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {
        let commentNumber = 0
        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber ++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.commentLists])        //부모로부터 받아오는 이 값이 변경될 때마다 useEffect를 실행 → 대댓글이 달리면 바로 표시됨

    const renderReplyComment = (parentCommentId) =>             //여기에 {}을 치면 대댓글이 표시되지 않음 
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft:'40px' }}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={props.videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} videoId={props.videoId} />
                    </div>
                }
            </React.Fragment>
        ))
    

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&       //이 조건이 없으면 버튼이 작동하지 않음
                renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment

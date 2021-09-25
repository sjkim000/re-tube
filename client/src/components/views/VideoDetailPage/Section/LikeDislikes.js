import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)
    let likeInfo = { }
    
    if(props.video) {
        // console.log('video : ', props.videoId)
        likeInfo = {videoId: props.videoId , userId: props.userId}
    } else {
        // console.log('comment : ', props.commentId)
        likeInfo = {commentId: props.commentId , userId: props.userId }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', likeInfo)
        .then(response => {
            if(response.data.success) {
                //얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)
                //내가 이미 좋아요를 눌렀는지
                response.data.likes.map(like => {
                    if(like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })
            } else {
                alert('좋아요 정보를 가져올 수 없습니다.')
            }
        })

        Axios.post('/api/like/getDislikes', likeInfo)
        .then(response => {
            if(response.data.success) {
                //얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)
                //내가 이미 싫어요를 눌렀는지
                response.data.dislikes.map(dislike => {
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })
            } else {
                alert('싫어요 정보를 가져올 수 없습니다.')
            }
        })

    }, [])

    const onLike = () => {
        if(LikeAction === null) {
            Axios.post('/api/like/upLike', likeInfo)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes + 1)
                    setLikeAction('liked')
                    if(DislikeAction !== null) {
                        setDislikeAction(null)
                        setDislikes(Dislikes - 1)
                    }
                } else {
                    alert('좋아요를 업카운트 할 수 없습니다.')
                }
            })
        } else {
            Axios.post('/api/like/unlike', likeInfo)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes - 1)
                    setLikeAction(null)
                } else {
                    alert('좋아요를 다운카운트 할 수 없습니다.')
                }
            })
        }
    }

    const onDislike = () => {
        if(DislikeAction !== null) {
            Axios.post('/api/like/undislike', likeInfo)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes - 1)
                    setDislikeAction(null)
                } else {
                    alert('싫어요를 다운카운트 할 수 없습니다.')
                }
            })
        } else {
            console.log('here')
            Axios.post('/api/like/upDislike', likeInfo)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')
                    if(LikeAction !== null) {
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }
                } else {
                    alert('좋아요를 다운카운트 할 수 없습니다.')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>&nbsp;&nbsp;


        </div>
    )
}

export default LikeDislikes

import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let subscribeInfo = { userTo: props.userTo }
        Axios.post('/api/subscribe/subscribeNumber', subscribeInfo)
        .then( response => {
            if(response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber)
                console.log(response.data)
            } else {
                alert('구독자 수 정보를 가져올 수 없습니다.')
            }
        })

        let subscribedInfo = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }
        Axios.post('/api/subscribe/subscribed', subscribedInfo)
        .then( response => {
            if(response.data.success) {
                setSubscribed(response.data.subscribed)
                console.log(response.data)
            } else {
                alert('정보를 가져올 수 없습니다.')
            }
        })

    }, [])

    const onSubscribe = () => {

        let subscribeInfo = {
            userTo: props.userTo ,
            userFrom: props.userFrom
        }
        //이미 구독중
        if(Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribeInfo)
            .then( response => {
                if(response.data.success) {
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독 취소 설정에 실패했습니다.')
                }
            })
        //구독중이 아님
        } else {
            Axios.post('/api/subscribe/subscribe', subscribeInfo)
            .then( response => {
                if(response.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독 설정에 실패했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000' }`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                
                {Subscribed ? '구독중' : '구독하기'} | 현재 {SubscribeNumber}명 구독중
            </button>
        </div>
    )
}

export default Subscribe

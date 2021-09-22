/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState }  from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RightMenu(props) {
  const user = useSelector(state => state.user)
  
  //Test
  //console.log(user.userData)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };
  
  //if (user.userData && !user.userData.isAuth) console.log(user.userData)
  //user.userData.isAuth가 안읽히는 상태임!!!
  if (user.userData && !user.userData.isAuth) {   //로그인 안된 사람
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {      //로그인 된사람
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/video/upload">Video</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout({localStorage.getItem("userName")})</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);


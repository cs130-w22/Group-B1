import React from 'react';
import './Login.css';
import * as Unicons from '@iconscout/react-unicons';

var pencil_icon_size = 47.5

const Login: React.FC = () => {
  return (
    <div className="center">
      <div className="login_banner">
        <div className="login_logo">
          <Unicons.UilPen size={pencil_icon_size} className="home"/>
        </div>
        <p>Login</p>
      </div>
    </div>
  )
}

export default Login;
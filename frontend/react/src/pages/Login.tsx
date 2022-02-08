import React from 'react';
import './Login.css';
import * as Unicons from '@iconscout/react-unicons';

var pencil_icon_size = 47.5

const Login: React.FC = () => {
  return (
    <div className="outer">
      <div className="middle">
        <div className="inner">
          <div className="login_wrapper">
            <div className="login_banner">
              <Unicons.UilPen size={pencil_icon_size} className="home pencil"/>
              <p>Login</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login;
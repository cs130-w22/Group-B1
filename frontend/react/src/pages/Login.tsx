
import React from 'react';
import './Login.css';
import * as Unicons from '@iconscout/react-unicons';

var people1 = require('../resources/people1.png')

const Login: React.FC = () => {
  return (
    <div className="center">
      <div className="square top_left"></div>
      <div className="square bottom_right"></div>
      <div className="login_banner">
        <img src={people1} className="people" alt="people" /> 
        <div className="login_region">
          <p className="instructions">Sign in to find your new roommates</p>
          <hr></hr>

          <input type="text" placeholder=" Username"/>
          <input type="password" placeholder=" Password" />
          <div className="login_button">
            <p>Login</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login;
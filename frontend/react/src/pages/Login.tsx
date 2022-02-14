
import React from 'react';
import './Login.css';
import * as Unicons from '@iconscout/react-unicons';

var people1 = require('../resources/people1.png')

export class Login extends React.Component{

  componentDidMount() {
    console.log("componentDidMount");
    fetch('http://localhost:5000/roommate/types/areas')
      .then(response => response.json())
      .then(data => console.log(data));
  }

  render() {
  return (
    <div className="login-center">
      <div className="login-square top_left"></div>
      <div className="login-square bottom_right"></div>
      <div className="login-login_banner">
        <img src={people1} className="login-people" alt="people" /> 
        <div className="login-login_region">
          <p className="login-instructions">Sign in to find your new roommates</p>
          <hr></hr>

          <input type="text" placeholder=" Username"/>
          <input type="password" placeholder=" Password" />
          <div className="login-login_button">
            <p>Login</p>
          </div>
          
        </div>
      </div>
    </div>
  );
  }
}

export default Login;
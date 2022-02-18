
import React from 'react';
import {useState} from 'react';
import './Login.css';

const people1 = require('../resources/people1.png')

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleUsernameChange = (event) => {
    window['connectDev'].user.username = event.target.value;
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    window['connectDev'].user.password = event.target.value;
    setPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    const rootUrl = window['connectDev'].rootUrl;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const response = JSON.parse(xmlHttp.responseText);
        window['connectDev'].authToken = response.accessToken;
        console.log('login success');
        console.log(xmlHttp.responseText);
        window.location.pathname = '/search';
      } else {
        console.log('login failed');
      }
    }
    xmlHttp.open("POST", rootUrl+'/roommate/login', true); // true for async
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
      username,
      password,
    }));
  }
  return (
    <div className="login-center">
      <div className="login-square top_left"></div>
      <div className="login-square bottom_right"></div>
      <div className="login-login_banner">
        <img src={people1} className="login-people" alt="people" /> 
        <div className="login-login_region">
          <p className="login-instructions">Sign in to find your new roommates</p>
          <hr></hr>

          <input id="username" type="text" placeholder=" Username" onChange={handleUsernameChange} />
          <input id="password" type="password" placeholder=" Password" onChange={handlePasswordChange} />
          <div className="login-login_button" onClick={handleSubmit}>
            <p>Login</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login;
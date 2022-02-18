
import React from 'react';
import './Login.css';
import * as Unicons from '@iconscout/react-unicons';

var people1 = require('../resources/people1.png')

function tryLogin(): void {
  // let un = document.getElementById('username').value || 'testuser';
  // let pw = document.getElementById('password').value || 'testpass';
  // window['connectDev'].user.username = un;
  // window['connectDev'].user.password = pw;

  var rootUrl = window['connectDev'].rootUrl;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var response = JSON.parse(xmlHttp.responseText);
      window['connectDev'].authToken = response.accessToken;
      console.log('login success');
      console.log(xmlHttp.responseText);
      window.location.pathname = '/search';
    }
  }
  xmlHttp.open("POST", rootUrl+'/roommate/login', true); // true for async
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.send(JSON.stringify({
    username: window['connectDev'].user.username,
    password: window['connectDev'].user.password
  }));
}

const Login: React.FC = () => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const handleUsernameChange = (event) => {
    window['connectDev'].user.username = event.target.value;
  };
  const handlePasswordChange = (event) => {
    window['connectDev'].user.password = event.target.value;
  };
  const handleSubmit = (event) => {
    tryLogin();
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
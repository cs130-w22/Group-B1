
import React from 'react';
import './Signup.css';
import * as Unicons from '@iconscout/react-unicons';

var people1 = require('../resources/people2.png')
var iconSize = 15

const fillSelect = () => {
  var arr = [] as any
  for (let i = 18; i < 100; i++) {
    arr.push(<option key={i} value="{i}">{i}</option>)
  }
  return arr;
}

const Signup: React.FC = () => {
  return (
    <div className="center">
      <div className="square top_left"></div>
      <div className="square bottom_right"></div>
      <div className="signup_banner">
        <div className="signup_region">
          <p className="instructions">Sign up and let's find your new roommates</p>
          <hr></hr>

          {/*login info*/}
          <div className="isolated_region">
            <p>Login Info</p>
            <input type="text" placeholder="Username"/>
            <input type="password" placeholder="Password" />
            <input type="text" placeholder="Email" />
          </div>

          {/*about user*/}
          <div className="isolated_region">
            <p>Tell us about yourself</p>
            <input type="text" placeholder=" First Name"/>
            <input type="text" placeholder=" Last Name" />
            <div className="inner_isolated_region">
              <input type="text" placeholder=" Area"/>
              <div>
                <p>Age</p>
                <select name="age">
                  {fillSelect()}
                </select>
              </div>
            </div>
          </div>

          <div className="signup_button">
            <p>Sign Up</p>
          </div>

        </div>
        <img src={people1} className="people" alt="people" /> 
      </div>
    </div>
  )
}

export default Signup;
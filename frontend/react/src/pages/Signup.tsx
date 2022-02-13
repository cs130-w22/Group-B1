
import React from 'react';
import './Signup.css';
import * as Unicons from '@iconscout/react-unicons';

var people2 = require('../resources/people2.png')

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

              <div className="info_container">
                <p className="title">Login Info</p>
                <input type="text" placeholder=" Username"/>
                <input type="text" placeholder=" Password"/>
              </div>

              <div className="info_container">
                <p className="title">Tell us about yourself</p>
                <input type="text" placeholder=" First Name"/>
                <input type="text" placeholder=" Last Name"/>
                <input type="text" placeholder=" Email"/>
                <div className="age_container">
                  <p>Age</p>
                  <select>
                    {fillSelect()}
                  </select>
                </div>
              </div>

              <div className="sign_up_button">
                <p>Sign Up</p>
              </div>

            </div>
            <img src={people2} className="people2" alt="people" /> 
          </div>
    </div>
  )
}

export default Signup;
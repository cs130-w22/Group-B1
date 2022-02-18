
import React from 'react';
import {useState} from 'react';
import './Signup.css';
import * as Unicons from '@iconscout/react-unicons';

var homePageIcon = require('../resources/banner.png')
var people2 = require('../resources/people2.png')

const fillSelect = () => {
  var arr = [] as any
  for (let i = 18; i < 100; i++) {
    arr.push(<option key={i} value="{i}">{i}</option>)
  }
  return arr;
}

const getTypes = (callback) => {
  const results = {
    areas: [],
    hobbies: [],
    personalities: []
  };
  const rootUrl = 'http://localhost:5000';
  // fetch areas
  const xmlHttpAreas = new XMLHttpRequest();
  xmlHttpAreas.onreadystatechange = function() { 
    if (xmlHttpAreas.readyState == 4 && xmlHttpAreas.status == 200) {
      results.areas = JSON.parse(xmlHttpAreas.responseText);
      console.log('fetched areas list');
      console.log(xmlHttpAreas.responseText);
      // fetch hobbies
      const xmlHttpHobbies = new XMLHttpRequest();
      xmlHttpHobbies.onreadystatechange = function() {
        if (xmlHttpHobbies.readyState == 4 && xmlHttpHobbies.status == 200) {
          results.hobbies = JSON.parse(xmlHttpHobbies.responseText);
          console.log('fetched hobbies list');
          console.log(xmlHttpHobbies.responseText);
          // fetch personalities
          const xmlHttpPersonalities = new XMLHttpRequest();
          xmlHttpPersonalities.onreadystatechange = function() {
            if (xmlHttpPersonalities.readyState == 4 && xmlHttpPersonalities.status == 200) {
              results.personalities = JSON.parse(xmlHttpPersonalities.responseText);
              console.log('fetched personalities list');
              console.log(xmlHttpPersonalities.responseText);
              // final return
              callback(results);
            }
          }
          xmlHttpPersonalities.open("GET", rootUrl+'/roommate/types/personalities', true); // true for async
          xmlHttpPersonalities.send(null);
          // finish fetch personalities
        }
      }
      xmlHttpHobbies.open("GET", rootUrl+'/roommate/types/hobbies', true); // true for async
      xmlHttpHobbies.send(null);
      // finish fetch hobbies
    }
  }
  xmlHttpAreas.open("GET", rootUrl+'/roommate/types/areas', true); // true for async
  xmlHttpAreas.send(null);
  // finish fetch areas
}
getTypes((types)=>{
  window['types'] = types;
});

const Signup: React.FC = () => {
  return (
    <div className="center">
      <div className="square top_left"></div>
        <div className="square bottom_right"></div>
          <div className="signup-signup_banner">
            <div className="signup-signup_region">
              <p className="signup-instructions">Sign up and let's find your new roommates</p>
              <hr></hr>

              <div className="signup-info_container">
                <p className="signup-title">Login Info</p>
                <input type="text" placeholder=" Username"/>
                <input type="text" placeholder=" Password"/>
              </div>

              <div className="signup-info_container">
                <p className="signup-title">Tell us about yourself</p>
                <input type="text" placeholder=" First Name"/>
                <input type="text" placeholder=" Last Name"/>
                <input type="text" placeholder=" Email"/>
                <div className="signup-age_container">
                  <p>Age</p>
                  <select>
                    {fillSelect()}
                  </select>
                </div>
              </div>

              <div className="signup-sign_up_button">
                <p>Sign Up</p>
              </div>

            </div>
            <img src={people2} className="signup-people2" alt="people" /> 
          </div>
    </div>
  )
}

export default Signup;
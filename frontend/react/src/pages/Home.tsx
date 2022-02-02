
import React from 'react';
import { Link } from "react-router-dom";
import './Home.css';
import Login from "./Login" 
import Signup from "./Signup" 
import * as Unicons from '@iconscout/react-unicons';

// images
var people = require('../resources/people.png')
var man1 = require('../resources/man1.png')
var woman1 = require('../resources/woman1.png')
var woman2 = require('../resources/woman2.png')

// unicon logo sizes
var col_icon_size = 47.5
var login_icon_size = 60

const Home: React.FC = () => {
  return (
    <div className="outer">
      <div className="middle">
        <div className="header"></div>
        <div className="inner">

          <img src={people} className="people" alt="people" /> 

          <div className="text_wrapper">
            <h3>Zoomie Roomies</h3>
            <h4>Finding roomates made fast.</h4>
          </div>
          
          <div className="buttons_wrapper">
            <div className="login">
              <Unicons.UilHome size={login_icon_size} className="home"/>
              <Link to="/login"> Login </Link>
            </div>

            <div className="signup">
              <Unicons.UilSignin size={login_icon_size} className="signin" />
              {/*<p>Sign Up</p>*/}
              <Link to="/signup"> Sign Up </Link>
            </div>
          </div>

        </div>
          <div className="row">
            <div className="col">
              <Unicons.UilSearch size={col_icon_size} className="settings"/>
              <h3>Your Preferences First</h3>
              <hr></hr>
              <p>Find your roommates faster by organizing based on your own preferences</p>
              <div className="quote_wrapper">
                <img src={man1} alt="man1" />
                <div>
                  <p className="quote">"Finding roommates that have the same hobbies as me has
                  never been so effortless, thanks to Zoomie Roomies!"</p>
                  <p className="quoter">- Dale Mason</p>
                </div>
              </div>
            </div>

            <div className="col">
              <Unicons.UilBed size={col_icon_size} className="search" />
              <h3>Searching Made Simple</h3>
              <hr></hr>
              <p>We provide a minimalistic layout in order to make searching as effortless as possible</p>
              <div className="quote_wrapper">
                <img src={woman2} alt="woman2" />
                <div>
                  <p className="quote">"The clean layout definitely makes finding your ideal
                  roommates the focus, I love it!"</p>
                  <p className="quoter">- Sarah Chambers</p>
                </div>
              </div>
            </div>

            <div className="col">
              <Unicons.UilMessage size={col_icon_size} className="contact" />
              <h3>Hassle-free Contact</h3>
              <hr></hr>
              <p>Get in contact directly via email with the roommates that you are interested in</p>
              <div className="quote_wrapper">
                <img src={woman1} alt="woman1" />
                <div>
                  <p className="quote">"Getting a direct line of communication to my future roommates
                  with an email is definitely a unique feature!"</p>
                  <p className="quoter">- Monique Gray</p>
                </div>
              </div>
            </div>
          </div>

        <footer>
          <p>Find your roommate today!</p>
          <div className="signup_footer"> 
            <p>Sign Up</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home;
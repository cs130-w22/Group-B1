import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import * as Unicons from "@iconscout/react-unicons";

// images
const people = require("../resources/people.png");
const man1 = require("../resources/man1.png");
const woman1 = require("../resources/woman1.png");
const woman2 = require("../resources/woman2.png");

// unicon logo sizes
const col_icon_size = 47.5;
const login_icon_size = 60;

/**
 * Home page links to login and signup pages
 */
const Home: React.FC = () => {
  return (
    <div className="home-outer">
      <div className="home-middle">
        <div className="home-header"></div>
        <div className="home-inner">
          <img src={people} className="home-people" alt="people" />

          <div className="home-text_wrapper">
            <h3>Zoomie Roomies</h3>
            <h4>Finding roomates made fast.</h4>
          </div>

          <div className="home-buttons_wrapper">
            <div className="home-login">
              <Link to="/login">
                <Unicons.UilHome size={login_icon_size} className="home-home" />
                <p>Login</p>
              </Link>
            </div>

            <div className="home-signup">
              <Link to="/signup">
                <Unicons.UilSignin
                  size={login_icon_size}
                  className="home-signin"
                />
                <p>Sign Up</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="home-row">
          <div className="home-col">
            <Unicons.UilSearch size={col_icon_size} className="home-settings" />
            <h3>Your Preferences First</h3>
            <hr></hr>
            <p>
              Find your roommates faster by organizing based on your own
              preferences
            </p>
            <div className="home-quote_wrapper">
              <img src={man1} alt="man1" />
              <div>
                <p className="home-quote">
                  "Finding roommates that have the same hobbies as me has never
                  been so effortless, thanks to Zoomie Roomies!"
                </p>
                <p className="home-quoter">- Dale Mason</p>
              </div>
            </div>
          </div>

          <div className="home-col">
            <Unicons.UilBed size={col_icon_size} className="home-search" />
            <h3>Searching Made Simple</h3>
            <hr></hr>
            <p>
              We provide a minimalistic layout in order to make searching as
              effortless as possible
            </p>
            <div className="home-quote_wrapper">
              <img src={woman2} alt="woman2" />
              <div>
                <p className="home-quote">
                  "The clean layout definitely makes finding your ideal
                  roommates the focus, I love it!"
                </p>
                <p className="home-quoter">- Sarah Chambers</p>
              </div>
            </div>
          </div>

          <div className="home-col">
            <Unicons.UilMessage size={col_icon_size} className="home-contact" />
            <h3>Hassle-free Contact</h3>
            <hr></hr>
            <p>
              Get in contact directly via email with the roommates that you are
              interested in
            </p>
            <div className="home-quote_wrapper">
              <img src={woman1} alt="woman1" />
              <div>
                <p className="home-quote">
                  "Getting a direct line of communication to my future roommates
                  with an email is definitely a unique feature!"
                </p>
                <p className="home-quoter">- Monique Gray</p>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>Find your roommate today!</p>
          <div className="home-signup_footer">
            <Link to="/signup">
              <p>Sign Up</p>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

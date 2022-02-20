import React from "react";
import { useState, useEffect } from "react";
import { createRoommate, fetchAreas } from "../util/ApiCalls";

import "./Signup.css";

const people2 = require("../resources/people2.png");

const Signup: React.FC = () => {
  // client data
  const [areas, setAreas] = useState([""]);
  const [areaText, setAreaText] = useState("Loading regions...");
  // user forms data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("Los Angeles");
  // user form updates
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };
  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };
  // server interaction
  const handleSubmit = async () => {
    const newUser = {
      username,
      password,
      profile: {
        firstName,
        lastName,
        email,
        area,
        bio: "[Tell everyone about yourself!]",
        hobbies: [],
        personality: [],
        additionalInfo:
          "[Anything else you think people should know about you?]",
      },
    };
    const response = await createRoommate(newUser);
    if (response.ok) {
      console.log("registration success");
      window.location.pathname = "/login";
    } else {
      alert((await response.json()).message);
    }
  };

  const getAreas = async () => {
    const response = await fetchAreas();
    if (response.ok) {
      setAreas(await response.json());
      setAreaText("Where are you from?");
    }
  };

  useEffect(() => {
    getAreas();
  }, []); // runs once on init
  // component
  return (
    <div className="center">
      <div className="square top_left"></div>
      <div className="square bottom_right"></div>
      <div className="signup-signup_banner">
        <div className="signup-signup_region">
          <p className="signup-instructions">
            Sign up and let's find your new roommates
          </p>
          <hr></hr>

          <div className="signup-info_container">
            <p className="signup-title">Login Info</p>
            <input
              type="text"
              placeholder=" Username"
              onChange={handleUsernameChange}
            />
            <input
              type="password"
              placeholder=" Password"
              onChange={handlePasswordChange}
            />
          </div>

          <div className="signup-info_container">
            <p className="signup-title">Tell us about yourself</p>
            <input
              type="text"
              placeholder=" First Name"
              onChange={handleFirstnameChange}
            />
            <input
              type="text"
              placeholder=" Last Name"
              onChange={handleLastnameChange}
            />
            <input
              type="text"
              placeholder=" Email"
              onChange={handleEmailChange}
            />
            <div className="signup-area_container">
              <p>{areaText}</p>
              <select onChange={handleAreaChange}>
                {areas.map((area) => {
                  return area === "Los Angeles" ? (
                    <option selected key={area} value={area}>
                      {area}
                    </option>
                  ) : (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="signup-sign_up_button" onClick={handleSubmit}>
            <p>Sign Up</p>
          </div>
        </div>
        <img src={people2} className="signup-people2" alt="people" />
      </div>
    </div>
  );
};

export default Signup;

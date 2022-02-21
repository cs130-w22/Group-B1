import React from "react";
import { useState, useEffect } from "react";
import { createRoommate, fetchAreas } from "../util/ApiCalls";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
    if ([username, password, firstName, lastName, email].includes("")) {
      alert("All fields must be provided");
      return;
    }

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
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <p className="signup-title">Tell us about yourself</p>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  onChange={handleUsernameChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
              </Form.Group>
              <p className="signup-title">Tell us about yourself</p>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  onChange={handleFirstnameChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  onChange={handleLastnameChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={handleEmailChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{areaText}</Form.Label>
                <Form.Select onChange={handleAreaChange}>
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
                </Form.Select>
              </Form.Group>
              <Button type="submit">Sign up</Button>
            </Form>
          </div>
        </div>
        <img src={people2} className="signup-people2" alt="people" />
      </div>
    </div>
  );
};

export default Signup;

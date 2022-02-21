import React from "react";
import { useState } from "react";
import "./Login.css";
import { loginRoommate } from "../util/ApiCalls";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const people1 = require("../resources/people1.png");

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsernameChange = (event) => {
    //window['connectDev'].user.username = event.target.value; // track data for debug
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    //window['connectDev'].user.password = event.target.value; // track data for debug
    setPassword(event.target.value);
  };
  const handleSubmit = async () => {
    const response = await loginRoommate(username, password);
    if (response.ok) {
      const accessToken = (await response.json()).accessToken;
      window.sessionStorage.setItem("accessToken", accessToken);
      window.sessionStorage.setItem("username", username);
      window.location.pathname = "/search";
    } else {
      const errorMessage = (await response.json()).message;
      alert(errorMessage);
    }
  };
  return (
    <div className="login-center">
      <div className="login-square top_left"></div>
      <div className="login-square bottom_right"></div>
      <div className="login-login_banner">
        <img src={people1} className="login-people" alt="people" />
        <div className="login-login_region">
          <p className="login-instructions">
            Sign in to find your new roommates
          </p>
          <hr></hr>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                id="username"
                type="text"
                placeholder=" Username"
                onChange={handleUsernameChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button type="submit">Login</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

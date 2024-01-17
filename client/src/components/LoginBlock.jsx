import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import "../styles/loginform.css";
import axios from "axios";

export const LoginBlock = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios
      .post("http://localhost:3023/login", { username, password })
      .then((response) => {
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response Status:", error.response.status);
          console.error("Response Data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up the request", error.message);
        }
      });
  };

  return (
    <>
      <div className="wrapper d-flex justify-content-center">
        <Card className="login">
          {/* Placeholder for Logo */}
          <Card.Img
            variant="top"
            src="/kpgansel/logo-gansel.png"
            style={{ width: "100px", height: "auto" }}
            alt="Logo"
          />
          {/* ... rest of your code ... */}

          <Card.Body>
            <Card.Title className="mb-3 justify-content-center">
              Login
            </Card.Title>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-2" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Username Anda"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Control.Feedback type="invalid" className="validText">
                  Please enter your username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan Password Anda"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid" className="validText">
                  Please enter your password.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember me" />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="btn btn-success w-100 mt-2"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

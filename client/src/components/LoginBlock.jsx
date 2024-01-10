import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import "../styles/loginform.css";

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
              <Form.Group className="mb-2" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan Username Anda"
                  required
                />
                <Form.Control.Feedback type="invalid" className="validText">
                  Please enter your username.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan Password Anda"
                  required
                />
                <Form.Control.Feedback type="invalid">
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

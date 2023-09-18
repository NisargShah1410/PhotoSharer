import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Nav, Navbar , NavDropdown , Container} from "react-bootstrap";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const loginAPI = process.env.REACT_APP_AUTHENTICATE;
  console.log(`${process.env.REACT_APP_AUTHENTICATE}`);
  console.log(loginAPI);

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Make a POST request to the backend for user registration
    const body = {
        email: email.toLowerCase(),
        password: password
    }

    try {
      const response = await axios.post(loginAPI, body);

      // Handle successful registration
      console.log('User Login successful');
      console.log(response);
      window.sessionStorage.setItem("email", email);
      window.sessionStorage.setItem("user_id", response.data.user_id);
      navigate("/");

    } catch (error) {
      console.log(error)
      console.log(error.response.status)
      if(error.response.status === 401)
        alert('No user found')
      else if(error.response.status === 402)
        alert('Authentication error')
      // Handle registration error
      else
        console.error('Login failed:', error.message);
    }
    setValidated(true);
  };
  return (<>
    <Navbar bg="primary" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">PhotoSharer</Navbar.Brand>
              <Nav className="me-auto">
              </Nav>
              <Nav>
                <Nav.Link href="/register">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </Nav>
            </Container>
    </Navbar>

    <Form  style={{ marginTop: "20px" , marginLeft: "20px" }} validated={validated}>
      <h2>Login </h2><br/>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control style={{width: "500px"}} type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value) } required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control style={{width: "500px"}} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      </Form.Group>
      
      
      <Button variant="primary" type="submit" onClick={handleLogin}>
        Submit
      </Button>
    </Form>
    </>
  );
}

export default Login;
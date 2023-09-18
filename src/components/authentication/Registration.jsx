import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Nav, Navbar , NavDropdown , Container} from "react-bootstrap";

const Register = () => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const registerAPI = process.env.REACT_APP_STORE;
  console.log(`${process.env.REACT_APP_STORE}`);
  console.log(registerAPI);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else{

    // Make a POST request to the backend for user registration
    const body = {
        email: email.toLowerCase(),
        username: username,
        password: password
    }

    try {
      const response = await axios.post(registerAPI, body);

      // Handle successful registration
      console.log('User registered successfully!');
      console.log(response.data.user_id);
      navigate("/login");

      return response;

    } catch (error) {
      // Handle registration error
      console.error('Registration failed:', error.message);
    }
    setValidated(true);
  }
};

  return (
  <>
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

    
    <Form style={{ marginTop: "20px" , marginLeft: "20px" }} validated={validated}>
      <h2>Sign Up </h2><br/>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control style={{width: "500px"}} type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <Form.Text className="text-muted">
          No spamming. Promise :)
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control style={{width: "500px"}} type="text" placeholder="Enter a unique username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control style={{width: "500px"}} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <Form.Text className="text-muted">
          Your password is safe with us
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control style={{width: "500px"}} type="password" placeholder="Password" required/>
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="I agree to Terms & Conditions of using this application." />
      </Form.Group>
      
      <Button variant="primary" type="submit" onClick={handleRegister}>
        Submit
      </Button>
    </Form>
    </>
  );
}

export default Register;
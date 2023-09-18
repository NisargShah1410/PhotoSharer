import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown, Container , Form , Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateInvite = () => {
    console.log(window.sessionStorage.getItem("user_id"));
    console.log(window.sessionStorage.getItem("email"));
  const [email, setEmail] = useState('');
  const [Message, setMessage] = useState('');
  const [invitationSuccess, setInvitationSuccess] = useState("");
  const [groupID,setGroupID] = useState("");
  const [groupName,setGroupName] = useState("");
  const navigate = useNavigate();

  const getAPI = process.env.REACT_APP_GETUSER;
  const inviteMemberAPI = process.env.REACT_APP_INVITEMEMBER;

  useEffect(() => {
    const getData = async () => {
      try{
        const response = await axios.post(getAPI, {"id": window.sessionStorage.getItem("user_id")});
        console.log(response.data[0].group_id);
        console.log(response.data[0].group_name);
        setGroupID(response.data[0].group_id);
        setGroupName(response.data[0].group_name);
        
    }
    catch(error){
      console.log(error);
  }
  }
    getData(); 

  }, [])
  
  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.reload();
    navigate("/login");
  }

  const sendInvitation = () => {
      const req = {
        "email": email,
        "group_id": groupID,
        "group_name": groupName,
        "message": Message
      }

      console.log(req);
      axios.post(inviteMemberAPI, req)
        .then((response) => {      
            console.log(response);
            console.log('Invitation sent:', response.data);
            setInvitationSuccess("Invite sent successfully !!");
        })
        .catch((error) => {
      console.error('Failed to send invitation:', error);
    })
  };

  return (
    <>
      {window.sessionStorage.getItem("email") ? (
        <>
          <Navbar bg="primary" data-bs-theme="dark">
                <Container>
                  <Navbar.Brand href="/">PhotoSharer</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <NavDropdown title="Groups" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/create">Create group</NavDropdown.Item>
                    <NavDropdown.Item href="/view">
                      View group
                    </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Invite" id="navbarScrollingDropdown">
                      <NavDropdown.Item href="/invite">
                        Invite a member
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/viewinvite">
                        View Invitations
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                  <Nav>
                    <Navbar.Text>{window.sessionStorage.getItem("email")}</Navbar.Text>
                    <Nav.Link onClick={handleLogout} href="/login">Logout</Nav.Link>
                  </Nav>
                </Container>
            </Navbar>

        <div style={{ marginTop: "20px" , marginLeft: "20px" }}>
        <h2>Create an invitation </h2><br/>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Invitation message</Form.Label>
        <Form.Control style={{width: "500px"}} type="text" placeholder="Enter your message" value={Message} onChange={(e) => setMessage(e.target.value)} required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Invite Email address</Form.Label>
        <Form.Control style={{width: "500px"}} type="email" placeholder="Enter email of user to invite" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      </Form.Group>
      
      <Button variant="primary" onClick={sendInvitation}>
      Send invitation
      </Button>
    </Form>
    </div>
    <br/>
    { invitationSuccess && <p>{invitationSuccess}</p>}
        </>
      ) : (
        <>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav>
                <Nav.Link onClick={""} href="/signup">Signup</Nav.Link>
                <Nav.Link onClick={""} href="/login">Login</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
        </>
      )}
    </>
  );
};

export default CreateInvite;
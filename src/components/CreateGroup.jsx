import React, {useState} from 'react';
import { Nav, Navbar, NavDropdown, Container , Form , Button} from "react-bootstrap";
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupID, setGroupID] = useState("");
  const [validated, setValidated] = useState(false);
  const [isGroupCreated, setGroupCreated] = useState(false);
  const navigate = useNavigate();
  console.log(window.sessionStorage.getItem("user_id"));

  const storeGroupAPI = process.env.REACT_APP_CREATE;
  const updateGroupAPI = process.env.REACT_APP_UPDATE;
  const userUpdateAPI = process.env.REACT_APP_UPDATEUSER;

const handleLogout = () => {
  window.sessionStorage.clear();
  window.location.reload();
  navigate("/login");
}

const createGroup = (event) => {
  event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);


  const body = {
    "group_id": Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
    "group_name": groupName,
    "group_members": [],
    "group_creator": window.sessionStorage.getItem("email")
  }

  console.log(body);
  
  axios.post(storeGroupAPI,body)
  .then((response) =>{
    console.log(response);
    console.log(response.data);
      console.log(response.data.Item.group_id);
      setGroupID(response.data.Item.group_id);
      updateGroup(response.data.Item.group_id);
      updateUser(response.data.Item.group_id);
      setGroupCreated(true);
      
    })
    .catch((error) => {console.log(error);})

}

const updateGroup = (ID) => {
  const body = {
    "group_id": ID,
    "new_member": window.sessionStorage.getItem("email")
  }

  console.log(body);

  axios.post(updateGroupAPI,body)
  .then((response) =>{
    console.log(response.data);
    })
    .catch((error) => {console.log(error);})
  
}

const updateUser = (ID) => {
  console.log();
  console.log();
  const body = {
    "group_id": ID,
    "group_name": groupName,
    "uid": window.sessionStorage.getItem("user_id")
  
  }

  console.log(body);

  axios.post(userUpdateAPI,body)
  .then((response) =>{
    console.log(response.data);
    })
    .catch((error) => {console.log(error);})
  
}

  return (
    <>
      { window.sessionStorage.getItem("email") ? (
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
        {!isGroupCreated && (<><div style={{ marginTop: "20px" , marginLeft: "20px" , marginBottom: "20px" }}>
        <h2 style={{  marginBottom: "20px" }}>Create a photo sharing group</h2>
        <Form validated={validated}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Group name </Form.Label>
        <Form.Control style={{width: "500px"}} type="text" placeholder="Give a name of Group" value={groupName} onChange={(e) => setGroupName(e.target.value) } required/>
      </Form.Group>
      
      
      <Button variant="primary" type="submit" onClick={createGroup}>
        Submit
      </Button>
    </Form>
    </div></>)}
    {isGroupCreated && (<><div style={{ marginTop: "20px" , marginLeft: "20px" , marginBottom: "20px" }}>
        <h2 style={{  marginBottom: "20px" }}>Group create successfully.</h2>
        <Button variant="outline-primary" onClick={() => navigate("/view")}>View Group</Button>
        
    </div></>)}
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
}

export default CreateGroup;
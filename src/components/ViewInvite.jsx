import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import axios from "axios";
import {Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ViewInvite = () => {
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteGroup, setInviteGroup] = useState("");
  const [inviteGroupID, setInviteGroupID] = useState("");
  const [invite, setInvite] = useState();
  const [receiptHandle, setReceiptHandle] = useState("");
  const [noInvite, setNoInvite] = useState(true);
  const navigate = useNavigate();


  const getNotification = process.env.REACT_APP_NOTIFICATIONGET;
  const deleteMessage = process.env.REACT_APP_NOTIFICATIONPOST;
  const updateAPI = process.env.REACT_APP_UPDATE;
  const userUpdateAPI = process.env.REACT_APP_UPDATEUSER;

  useEffect(() => {
    const getData = async () => {
        try{
        const response = await axios.get(getNotification);
        console.log(response.data);
        response.data.forEach(msg => {
            console.log(JSON.parse(msg.Body).MessageAttributes.email['Value']);
            console.log(JSON.parse(msg.Body).MessageAttributes.group_name['Value']);
            console.log(JSON.parse(msg.Body).Message);
            console.log(msg.ReceiptHandle);
            if(JSON.parse(msg.Body).MessageAttributes.email['Value']===window.sessionStorage.getItem("email")){
            console.log("yes")
            setNoInvite(false);
            setInvite(msg.Body);
            setInviteMessage(JSON.parse(msg.Body).Message);
            setInviteEmail(JSON.parse(msg.Body).MessageAttributes.email['Value']);
            setInviteGroup(JSON.parse(msg.Body).MessageAttributes.group_name['Value']);
            setInviteGroupID(JSON.parse(msg.Body).MessageAttributes.group_id['Value']);
            setReceiptHandle(msg.ReceiptHandle); 
            }  
        });
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
  
  const handleAccept = (event) => {
    event.preventDefault();
    axios.post(deleteMessage, {receiptHandle: receiptHandle })
        .then((response) => {
            console.log(response.data);
            updateTeam(inviteGroupID);
            updateUser(inviteGroupID,inviteGroup)
        })
        .catch((error) => {
            console.log(error);
        })
  }

  const handleDecline = (event) => {
    event.preventDefault();
    axios.post(deleteMessage, {receiptHandle: receiptHandle })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
  }

  const updateTeam = (ID) => {
    const body = {
      "group_id": parseInt(ID, 10),
      "new_member": window.sessionStorage.getItem("email")
    }
  
    console.log(body);
  
    axios.post(updateAPI,body)
    .then((response) =>{
      console.log(response.data);
      })
      .catch((error) => {console.log(error);})
    
  }
  
  const updateUser = (ID,teamName) => {
    console.log(ID);
    console.log(teamName);
    const body = {
      "group_id": parseInt(ID, 10),
      "group_name": teamName,
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

    
    <br/>
    <div style={{marginTop: "20px" , marginLeft: "20px"}}>
    {noInvite && <h3 style={{ textAlign: "center" , marginLeft: "20px"}}>No invites to show !!</h3>}
    { invite && (<div>  {inviteMessage && <p>Invite Message: {inviteMessage}</p>}
                        {inviteEmail && <p>Invite Email: {inviteEmail}</p>}  
                        {inviteGroup && <p>Team: {inviteGroup}</p>}
                        {inviteGroupID && <p>Team ID: {inviteGroupID}</p>}
                      </div>              
    )}
    {invite ? (
        <>
        <Button style={{marginRight: "5px"}}variant="outline-success" onClick={handleAccept}>
          Accept
        </Button>
        <Button variant="outline-danger" onClick={handleDecline}>
          Decline
        </Button>
        </>
      ) : (
        <></>
      )}
      </div>
        </>
      ) : (
        <>
          <Navbar bg="primary" data-bs-theme="dark">
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

export default ViewInvite;
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown , Nav , Button , Form , Image} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';


const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const navigate = useNavigate();  
  
  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.reload();
    navigate("/login");
  }
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
    setFileType(event.target.files[0].type);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    console.log(selectedFile);
    console.log(fileName);
    console.log(fileType);

    // Read the selected image as a base64 string
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageBase64 = event.target.result.split(',')[1];
      console.log(imageBase64);

      // Make a POST request to your AWS Lambda endpoint
      try {
        const response = await axios.post(
          'https://rpykwwy6xyckf5smmtouq5jacu0adcvb.lambda-url.us-east-1.on.aws/', // Replace with your actual API Gateway URL
          { body: imageBase64 , name: fileName , type:fileType }
        );

        // If successful, you can handle the response (e.g., display the uploaded image URL)
        const imageURL = response.data.imageURL;
        setImageURL(imageURL);
        alert(`Image uploaded successfully!\nImage URL: ${imageURL}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again later.');
      }
    };

    // Read the selected image as a Data URL (base64)
    reader.readAsDataURL(selectedFile);
  };

  const handleDownload = () => {
    // Create a temporary anchor element to trigger the download
    
    window.location.href = imageURL;
    // Clean up the temporary anchor element
  };

  return (
  <>{ window.sessionStorage.getItem("email") ? (
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
        <div style={{marginTop: "30px", marginLeft:"30px"}}>
        <p>This is Temporary photo sharing web-app using AWS services.</p>  
        <p>The purpose of this app is to create a temporary group and invite everyone</p> 
        <p> Everyone can upload photos / download photos available
          in the particular group</p>
        <p>When the purpose is done the group can be deleted. </p>
        <Button variant="outline-primary" onClick={() => navigate("/view")} style={{marginRight: "10px"}}>View Group</Button>
        <Button variant="outline-primary" onClick={() => navigate("/invite")}>Create Invite</Button>
        </div>
          
          </>): (
          <>
            <Navbar bg="primary" data-bs-theme="dark">
                <Container>
                  <Navbar.Brand href="/">PhotoSharer</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/statistics">Statisctics</Nav.Link>
                    <NavDropdown title="Groups" id="navbarScrollingDropdown">
                    <NavDropdown.Item href="/create">Create group</NavDropdown.Item>
                    <NavDropdown.Item href="/view">
                      View group
                    </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="/invite">
                        Invite a member
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/viewinvite">
                        View Invitations
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                  <Nav>
                    <Nav.Link href="/register">Sign Up</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav>
                </Container>
            </Navbar>
        <div style={{marginTop: "30px", marginLeft:"30px"}}>
        <p>This is Temporary photo sharing web-app using AWS services.</p>  
        <p>The purpose of this app is to create a temporary group and invite everyone</p> 
        <p> Everyone can upload photos / download photos available
          in the particular group</p>
        <p>When the purpose is done the group can be deleted. </p>
        <Button variant="outline-primary" onClick={() => navigate("/login")} style={{marginRight: "10px"}}>Login</Button>
        <Button variant="outline-primary" onClick={() => navigate("/register")}>Register</Button>
        </div>
      </>)}
    
    </>
  );
};

export default ImageUpload;

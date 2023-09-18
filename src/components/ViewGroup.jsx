import React, {useState , useEffect} from 'react';
import { Nav, Navbar, NavDropdown, Container , Form , Button , Image , Table} from "react-bootstrap";
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';

function ViewGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupID, setGroupID] = useState("");
  const [groupMembers, setGroupMembers] = useState("");
  const [groupCreator, setGroupCreator] = useState("");
  const [isCreator, setCreator] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isUploadEnable , setUploadEnable] = useState(false);
  const [isShowImageEnable, setShowImageEnable] = useState(false);
  const [allImages, setAllImages] = useState([]);

  const imageuploadAPI = process.env.REACT_APP_IMAGEUPLOAD;
  const getimagesAPI = process.env.REACT_APP_GETIMAGES;

  const handleLogout = () => {
    window.sessionStorage.clear();
    window.location.reload();
    navigate("/login");
  }

  const handleDownloadAll = () => {
    const downloadImage = async (image, index) => {
      window.location.href = image.image_url;
  
      // A short delay to let download process complete
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // Download the next image if available
      if (index + 1 < allImages.length) {
        downloadImage(allImages[index + 1], index + 1);
      }
    };
  
    if (allImages.length > 0) {
      downloadImage(allImages[0], 0);
    }
  };
  
  
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
          imageuploadAPI, // Replace with your actual API Gateway URL
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


  const handleDeleteGroup = async () => {
    const req ={
      "id": groupID,
      "images": allImages
    };
    console.log(req);
  
    try {
      const mem = groupMembers;
      const response = await axios.post(deleteGroupAPI, req); // Replace with your actual API Gateway URL
  
      // If successful, you can handle the response (e.g., display the uploaded image URL)
      console.log(response.data);
  
      for (const member of mem) {
        const deleteReq = {
          "user_email": member,
          "group_id": "",
          "group_name": "",
        };
  
        try {
          const deleteResponse = await axios.post(deleteGroupInfoMember, deleteReq); // Replace with your actual API Gateway URL
  
          // If successful, you can handle the response (e.g., display the uploaded image URL)
          console.log(deleteResponse.data);
          navigate("/")
        } catch (error) {
          console.error('Error removing group details from user:', error);
        }
      }
  
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };
  


  const handleSingleUpload = async () =>{
    const req = {
      "image_id": fileName,
      "group_id": groupID,
      "group_name": groupName,
      "uploader_id": window.sessionStorage.getItem("user_id"),
      "uploader_email": window.sessionStorage.getItem("email"),
      "image_url": imageURL,
    }
    console.log(req);

    try {
      const response = await axios.post(storeImageAPI ,req); // Replace with your actual API Gateway URL
      
      // If successful, you can handle the response (e.g., display the uploaded image URL)
      console.log(response.data);
      const imageURL = response.data.imageURL;
    
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  const handleDownload = () => {
    // Create a temporary anchor element to trigger the download
    
    window.location.href = imageURL;
    // Clean up the temporary anchor element
  };

  const handleMapDownload = (imgurl) => {
    window.location.href = imgurl;
  }

  const handleShowAllimages = (e) => {
    setShowImageEnable(true)
    const req = {
      "group_id": groupID
    }

    console.log(req);
    axios.post(getimagesAPI, req)
      .then((response) => {      
          console.log(response.data);
          console.log(response.data[0].image_id)
          setAllImages(response.data);

      })
      .catch((error) => {
    console.error('Error retrieving images:', error);
  })
  };

  const navigate = useNavigate();

  const getAPI = process.env.REACT_APP_GETUSER;
  const getGroupAPI = process.env.REACT_APP_GETGROUP;
  const storeImageAPI = process.env.REACT_APP_STOREIMAGE;
  const deleteGroupAPI = process.env.REACT_APP_DELETEGROUP;
  const deleteGroupInfoMember = process.env.REACT_APP_DELETEMEMBER;

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

   useEffect(() => {
    const getGroupData = async () => {
      try{

        const res = await axios.post(getGroupAPI, {"id": groupID});
        console.log("res");
        console.log(res);
        console.log(res.data[0].group_members);
        setGroupMembers(res.data[0].group_members);
        console.log(res.data[0].group_creator);
        setGroupCreator(res.data[0].group_creator);
        // if(groupCreator === window.sessionStorage.getItem("email")){
        //   setCreator(true);
        // }
    
    }
    catch(error){
      console.log(error);
  }
  }
  getGroupData(); 

  }, [groupID])

  useEffect(() => {
    // Call handleSingleUpload whenever imageURL changes (after image upload)
    if (imageURL) {
      handleSingleUpload();
    }
  }, [imageURL]);

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

        <div style={{marginTop: "20px" , marginLeft: "20px"}}>
        {!groupID && <h3 style={{textAlign: "center" , marginTop: "30px" , marginLeft: "20px"}}>You are not associated with any group !!</h3>}
        { groupID && (<div>  {groupName && <p>Group Name: {groupName}</p>}
                        {groupID && <p>Group ID: {groupID}</p>}  
                        {groupID && groupMembers && <p>Group members: <ul>
            {groupMembers.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul></p>}  
                      </div>              
        )}
        </div>
        <div style={{marginLeft: "20px", marginRight:"10px"}}>
        {groupID && !isUploadEnable && !isShowImageEnable && (<Button style={{marginRight:"10px"}} variant="primary" type="submit" onClick={(e) => setUploadEnable(true)}>Upload an Image</Button>)}
        {groupID && !isShowImageEnable && (<Button variant="primary" style={{marginRight:"10px"}} type="submit" onClick={handleShowAllimages} >Show all shared images</Button>)}
        {groupCreator === window.sessionStorage.getItem("email") && (<Button variant="danger" style={{ marginRight: "10px" }} type="submit" onClick={handleDeleteGroup}>Delete Group</Button>)}
        {isShowImageEnable && allImages && (<><Button variant="success" style={{ marginRight: "10px" }} onClick={handleDownloadAll}>Download All</Button><br/><br/></>)}
        </div>
      {isUploadEnable && !isShowImageEnable && (<div style={{marginTop: "20px" , marginLeft: "20px"}}><br/>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload you want to keep on cloud</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} accept="image/*" style={{width: "600px"}}/>
      </Form.Group>
      {/* <input type="file" onChange={handleFileChange} accept="image/*" /> */}
      <Button variant="outline-primary" onClick={handleUpload}>Upload</Button>
    
    <br/><br/>
    {imageURL && <h5>{fileName}</h5>}
    {imageURL && <Image src={imageURL} style={{ width: "60%", height: '60%' }}></Image>}
    <br/><br/>
    {imageURL && <Button variant="outline-success" onClick={handleDownload}>Download</Button>}{'     '}

    {imageURL && <a href={imageURL} download={fileName}>
        Download {fileName}
      </a>}
        
        </div>)}
        {isShowImageEnable && allImages && (<>
          <div>
          <Table striped bordered hover variant="light">
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Image</th>
              <th style={{ width: "20%" }}>Image name</th>
              <th style={{ width: "20%" }}>Uploaded by</th>
              <th style={{ width: "10%" }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {allImages.map((image, index) => (
              <tr key={index}>
                <td style={{ width: "50%" }}>
                  <Image src={image.image_url} style={{ width: "100%", height: "auto" }}></Image>
                </td>
                <td style={{ width: "20%" }}>{image.image_id}</td>
                <td style={{ width: "20%" }}>{image.uploader_email}</td>
                <td style={{ width: "25%" }}>
                  <Button variant="outline-success" onClick={() => handleMapDownload(image.image_url)}>Download</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
          </div>
        </>)}
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

export default ViewGroup;
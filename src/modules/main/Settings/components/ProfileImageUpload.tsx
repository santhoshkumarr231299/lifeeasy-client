import React, { useEffect, useState } from 'react';
import { Avatar, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import '../styles/profilepic-upload.css';
import axios from '../../../../api/axios';
import { Button } from 'react-bootstrap';

function ProfileImageUpload({ username, setOpenPopup, setSeverityForPopup, setMessageForPopup, theme }) {
    const [formData, setFormData] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [profileImage, setProfileImage] = useState<any>(null);

    const getProfileImage = () => {
        axios.get("/get-profile-image", { responseType: 'blob' }).then((res) => {
            setProfileImage(URL.createObjectURL(res.data));
        });
    }

    const cancelUpload = () => {
      setSelectedImage(null);
      setFormData(null);
    }

    const uploadImage = async () => {
      return new Promise(async (resolve, reject) => {
        if(formData) {
          await axios.post("/profile-image-upload", formData, {
            headers : {
              "Content-Type": "multipart/form-data",
            }
          }).then((response) => {
            if(response.data.status == "success") {
              cancelUpload();
              setOpenPopup(true);
              setSeverityForPopup(response.data.status);
              setMessageForPopup(response.data.message);
              getProfileImage();
              resolve(true);
            } else {
              setOpenPopup(true);
              setSeverityForPopup(response.data.status);
              setMessageForPopup(response.data.message);
              resolve(false);
            }
          }).catch(e => {
            setOpenPopup(true);
            setSeverityForPopup("error");
            setMessageForPopup("Something went wrong");
            resolve(false);
          })
        }
      })
    }

    const FileUpload = () => {
        const handleFileUpload = (event : any) => {
          const file = event.target.files[0];
          setSelectedImage(() => file.name);
          const formDataTemp = new FormData();
          formDataTemp.append("file", file);
          setFormData(() => formDataTemp);
        }
        return (
          <label
            htmlFor="upload-photo"
            style={{
              marginTop: "20px",
            }}
          >
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
    
            <div>
              <Fab
                color="secondary"
                size="small"
                component="span"
                aria-label="add"
                variant="extended"
                style={{
                  backgroundColor: theme.others
                }}
              >
              { selectedImage ? <RemoveIcon /> : <AddIcon />} { selectedImage ? selectedImage : "Update Profile Image" }
              </Fab>
            </div>
            <div>
            {selectedImage ? 
            <div>
              <Button 
              style={{
                marginTop: "10px",
                marginRight : "10px",
                backgroundColor: "green",
                alignItems: "center"
              }}
              type="button"
              onClick={uploadImage}
            >
              Upload
            </Button> 
            <Button 
              style={{
                marginTop: "10px",
                marginLeft : "10px",
                backgroundColor: "red",
                alignItems: "center"
              }}
              type="button"
              onClick={cancelUpload}
            >
              Cancel
            </Button> 
            </div>
              : ""}
            </div>
          </label>
        );
    }
    
    useEffect(() => {
        getProfileImage();
    }, []);
    
    return (<div className="profile-pic-upload" >
            <Avatar sx={{ bgcolor: "purple", margin: "auto", width: 100, height: 100 }}>
                {profileImage ? <img src={profileImage} alt="Profile Image" style={{ width: 100, height: 100 }} /> : 
                <h1 className="profile-upload-default-image">{username ? username[0].toUpperCase() : ""}</h1>
                }
            </Avatar>
            {FileUpload()}
            </div>);
}

export default ProfileImageUpload;
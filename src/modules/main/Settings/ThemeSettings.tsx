import axios from "../../api/axios";
import React, { useState } from "react";
import { Paper, Button, TextField, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function ThemeSettings({ theme }) {
  const [user, setUser] = useState({});
  const [option, setOption] = useState(1);
  const [isButtonClicked, setButtonClicked] = useState(false);
  const settings = () => {
    switch (option) {
      case 1:
        return <UserDetails />;
      default:
    }
  };
  const callChangePass = (e) => {
    e.preventDefault();
    if (!isButtonClicked) {
      setButtonClicked(true);
      setOption(2);
    } else {
      setButtonClicked(false);
      setOption(1);
    }
  };
  return (
    <div>
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          alignSelf: "center",
          margin: "auto",
          backgroundColor: theme.background,
          width: "1560px",
          height: "810px",
        }}
      >
       <div style={{
        marginBottom : "20px"
       }}>
          <Button
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              margin: "15px",
              right: -400,
              backgroundColor: theme.others,
            }}
            variant="contained"
            onClick={(e) => option == 2 ? setOption(1) : setOption(2)}
          >
            {option == 1 ? "Back" : "Change Password"}
          </Button>
       </div>
        {settings()}
      </Paper>
    </div>
  );
}

function UserDetails({ user, setUser, theme }) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  
  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div>
      Hello
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

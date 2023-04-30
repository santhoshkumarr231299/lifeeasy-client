import axios from "../../api/axios";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function LogoutPage(props) {
  const navigate = useNavigate();
  const logoutUser = (e) => {
    e.preventDefault();
    axios
      .post("/logout", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        try {
        Cookies.remove(process.env.REACT_APP_SECRET_COOKIE_KEY);
        } catch(e) {
          //
        }
        // navigate("/login");
        window.location.reload();
      });
  };
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    props.close();
  };
  return (
    <div className="logout-page">
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>You want to logout</DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "purple" }}
            autoFocus
            onClick={(e) => props.close()}
          >
            Cancel
          </Button>
          <Button
            style={{ color: "purple" }}
            onClick={(e) => logoutUser(e)}
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

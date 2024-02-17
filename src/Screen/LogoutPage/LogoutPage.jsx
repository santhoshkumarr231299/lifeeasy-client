import axios from "../../api/axios";
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";

export default function LogoutPage(props) {
  const logoutUser = async (e) => {
    e.preventDefault();
    try {
      Cookies.remove(process.env.REACT_APP_SECRET_COOKIE_KEY);
    } catch(e) {
      //
    } finally {
      localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS);
    }
    await axios.post("/logout");
     window.location.reload();
  };
  const [open] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

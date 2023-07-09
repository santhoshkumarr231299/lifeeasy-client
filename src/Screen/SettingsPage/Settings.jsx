import axios from "../../api/axios";
import React, { useState } from "react";
import { Paper, Button, TextField, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Cookies from "js-cookie";
import {
  validateBranchId,
  validateEmail,
  validatePassword,
  validatePharmacyName,
  validatePhoneNumber,
  validateUsername,
} from "../../Validations/validations";

export default function Settings(props) {
  const [option, setOption] = useState(1);
  const [isButtonClicked, setButtonClicked] = useState(false);
  const settings = () => {
    switch (option) {
      case 1:
        return <UserDetails username={props.username} />;
      case 2:
        return <ChangePass />;
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
          backgroundColor: "white",
          width: "1560px",
          height: "810px",
          color: "Black",
        }}
      >
        <Button
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            margin: "15px",
            right: -400,
            backgroundColor: "purple",
          }}
          variant="contained"
          onClick={(e) => callChangePass(e)}
        >
          {isButtonClicked ? "Back" : "Change Password"}
        </Button>
        {settings()}
      </Paper>
    </div>
  );
}

function UserDetails(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState({});
  const userFields = [
    {
      id: 1,
      fieldName: "username",
      labelName: "Username",
      value: user.username,
      status: "disabled",
      dispStatus: true,
    },
    {
      id: 2,
      fieldName: "email",
      labelName: "Email",
      value: user.email,
      status: "disabled",
      dispStatus: true,
    },
    {
      id: 3,
      fieldName: "mobile-number",
      labelName: "Mobile Number",
      value: user.mobileNumber,
      status: "active",
      dispStatus: true,
    },
    {
      id: 4,
      fieldName: "pharmacy-name",
      labelName: "Pharmacy Name",
      value: user.pharmacyName,
      status: "disabled",
      dispStatus: user.pharmacyName === "" ? false : true,
    },
    {
      id: 5,
      fieldName: "branch-id",
      labelName: "Branch ID",
      value: user.branchId,
      status: "disabled",
      dispStatus: user.pharmacyName === "" ? false : true,
    },
  ];
  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  async function validation() {
    let valid = await validateUsername(user.username);
    if (valid !== "") {
      return valid;
    }
    valid = validateEmail(user.email);
    if (valid !== "") {
      return valid;
    }
    valid = validatePhoneNumber(user.mobileNumber);
    if (valid !== "") {
      return valid;
    }
    valid = validatePharmacyName(user.pharmacyName);
    if (valid !== "") {
      return valid;
    }
    valid = validateBranchId(user.branchId);
    if (valid !== "") {
      return valid;
    }
    return "";
  }

  const updateDetails = async (e) => {
    e.preventDefault();
    let valid = await validation();
    if (valid !== "") {
      setOpen(true);
      setSeverity("warning");
      setMessage(valid);
      return;
    } else {
      setIsBtnDisabled(true);
      await axios
        .post("/update-user-details", {
          username: user.username,
          email: user.email,
          mobileNumber: user.mobileNumber,
          pharmacyName: user.pharmacyName,
          branchId: user.branchId,
          secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
        })
        .then((resp) => {
          setOpen(true);
          setSeverity(resp.data.status);
          setMessage(resp.data.message);
          setIsBtnDisabled(false);
        })
        .catch((err) => {
          setOpen(true);
          setSeverity("error");
          setMessage("Something went wrong");
          setIsBtnDisabled(false);
        });
    }
  };
  const updateValues = (e, id) => {
    let tempUser = user;
    // userFields[id - 1].value = e.target.value;
    switch (id) {
      case 2:
        tempUser.email = e.target.value;
        setUser(tempUser);
        break;
      case 3:
        tempUser.mobileNumber = e.target.value;
        setUser(tempUser);
        break;
      default:
    }
  };
  const fetchData = async () => {
    setIsLoading(true);
    let tempUser;
    await axios
      .post("/get-user-details", {
        username: props.username,
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        tempUser = resp.data;
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false);
        console.log("Error fetching details...");
      });;
    setUser(tempUser);
  }
  useEffect(() => {
    fetchData();
  }, []);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      {isLoading ? (<div><CircularProgress style={{ marginRight: "10px" }} size={20} /> </div>) :
      userFields.map((userField) => (
        <div key={userField.id}>
          <InputGroup
            className="mb-3"
            style={{ display: userField.dispStatus ? "flex" : "none", alignItems: "center" }}
          >
            <InputGroup.Text style={{ minWidth: "150px", height: "40px" }}>
              {userField.labelName}
            </InputGroup.Text>
            <Form.Control
              key={userField.id}
              style={{ margin: "5px", height: "40px" }}
              label={userField.labelName}
              disabled={userField.status === "disabled"}
              defaultValue={userField.value}
              onChange={(e) => updateValues(e, userField.id)}
              required
              aria-label="First name"
            />
          </InputGroup>
          {/* <input
            key={userField.id}
            style={{ margin: "10px" }}
            label={userField.labelName}
            disabled={userField.status === "disabled"}
            defaultValue={userField.value}
            variant="outlined"
            onChange={(e) => updateValues(e, userField.id)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <br /> */}
        </div>
      ))}
      <Button
        style={{
          marginBottom: "20px",
          marginTop: "10px",
          backgroundColor: "purple",
        }}
        variant="contained"
        onClick={(e) => updateDetails(e)}
        disabled={isBtnDisabled}
      >
        {isBtnDisabled && (<CircularProgress style={{ marginRight: "10px" }} size={20} />)}
        Save Details
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function ChangePass(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [oldPass, setOldPass] = useState("");

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  const changePassFields = [
    {
      id: 1,
      type: "text",
      fieldName: "newpass",
      labelName: "New Password",
      status: "active",
    },
    {
      id: 2,
      type: "password",
      fieldName: "confirm-newpass",
      labelName: "Confirm New Password",
      status: "active",
    },
    {
      id: 3,
      type: "password",
      fieldName: "old-password",
      labelName: "Old Password",
      status: "active",
    },
  ];
  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };
  const updatePassword = async () => {
    setIsBtnDisabled(true);
    if (newPass === confirmNewPass) {
      let valid = validatePassword(newPass);
      if (valid !== "") {
        setOpen(true);
        setSeverity("warning");
        setMessage(valid);
        setIsBtnDisabled(false);
        return;
      } else {
        await axios
          .post("/update-pass", {
            newPass: newPass,
            oldPass: oldPass,
            secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
          })
          .then((resp) => {
            setSeverity(resp.data.status);
            setMessage(resp.data.message);
            setOpen(true);
            setIsBtnDisabled(false);
          })
          .catch((err) => {
            setMessage("Something went wrong");
            setSeverity("error");
            setOpen(true);
            setIsBtnDisabled(false);
          });
      }
    } else {
      setMessage("New Password Mismatch");
      setSeverity("warning");
      setOpen(true);
    }
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {changePassFields.map((field) => (
        <div key={field.id}>
          <TextField
            style={{ margin: "10px" }}
            id={field.fieldName}
            type={field.type}
            label={field.labelName}
            variant="outlined"
            disabled={field.status === "disabled"}
            onChange={(e) => {
              if (field.fieldName === "newpass") {
                setNewPass(e.target.value);
              } else if (field.fieldName === "confirm-newpass") {
                setConfirmNewPass(e.target.value);
              } else {
                setOldPass(e.target.value);
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
            required={true}
          />
          <br />
        </div>
      ))}
      <Button
        style={{
          backgroundColor: "purple",
          marginBottom: "20px",
          marginTop: "10px",
        }}
        variant="contained"
        onClick={(e) => updatePassword(e)}
        disabled={isBtnDisabled}
      >
        {isBtnDisabled && (<CircularProgress style={{ marginRight: "10px" }} size={20} />)}
        Save New Password
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

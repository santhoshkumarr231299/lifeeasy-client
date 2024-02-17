import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, Paper, CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Cookies from "js-cookie";
import {
  validateUsername,
  validateEmail,
  validatePhoneNumber,
  validateAdddress,
  validateBranchId,
  validatePassword,
} from "../../Validations/validations";
import { PasswordRounded } from "@mui/icons-material";

export default function ManagerPage() {
  const [pageStatus, setPageStatus] = useState(false);
  const changeStatus = (val) => {
    setPageStatus(val);
  };
  const getPage = () => {
    switch (pageStatus) {
      case true:
        return <AddManagerPage addCustomerStatus={changeStatus} />;
      default:
        return <ManagerReportPage addCustomerStatus={changeStatus} />;
    }
  };
  return <>{getPage()}</>;
}

function ManagerReportPage(props) {
  const [dataGridRows, setDataGridRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let temp = [];
    let counter = 0;
    axios
      .post("/get-managers", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        resp.data.forEach((data) => {
          temp.push({
            id: ++counter,
            name: data.username,
            email: data.email,
            branch: data.branch,
            address: data.address,
          });
        });
        setDataGridRows(temp);
        setIsLoading(false);
      }).catch(err => {
        console.log("Error fetching details...");
        setIsLoading(false);
      });
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Manager Name", width: 180 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "branch", headerName: "Branch ID", width: 70 },
    { field: "address", headerName: "Address", width: 300 },
  ];
  return (
    <Paper
      elevation={3}
      style={{
        textAlign: "right",
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
          right: 65,
          backgroundColor: "purple",
        }}
        variant="contained"
        onClick={() => props.addCustomerStatus(true)}
      >
        Add Manager
      </Button>
      <DataGrid
        style={{
          alignSelf: "center",
          width: "1460px",
          height: "710px",
          margin: "auto",
        }}
        getRowHeight={() => 'auto'}
        loading={isLoading}
        rows={dataGridRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Paper>
  );
}

function AddManagerPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [conPassword, setConPassword] = useState("");

  const updateValues = (e, fieldId) => {
    switch (fieldId) {
      case 1:
        setName(e.target.value);
        break;
      case 2:
        setEmail(e.target.value);
        break;
      case 3:
        setBranch(e.target.value);
        break;
      case 4:
        setAddress(e.target.value);
        break;
      case 5:
        setMobileNumber(e.target.value);
        break;
      case 6:
        setPassword(e.target.value);
        break;
      case 7:
        setConPassword(e.target.value);
        break;
      default:
        console.log("Not Valid");
        break;
    }
  };

  const Fields = [
    {
      id: 1,
      type: "text",
      fieldName: "name",
      labelName: "Manager Username",
      status: "active",
    },
    {
      id: 2,
      type: "email",
      fieldName: "email",
      labelName: "Email",
      status: "active",
    },
    {
      id: 3,
      type: "number",
      fieldName: "branch",
      labelName: "Branch ID",
      status: "active",
    },
    {
      id: 4,
      type: "text",
      fieldName: "address",
      labelName: "Address",
      status: "active",
    },
    {
      id: 5,
      type: "number",
      fieldName: "mobilenumber",
      labelName: "Mobile Number",
      status: "active",
    },
    {
      id: 6,
      type: "password",
      fieldName: "password",
      labelName: "Password",
      status: "active",
    },
    {
      id: 7,
      type: "password",
      fieldName: "confirm-password",
      labelName: "Confirm Password",
      status: "active",
    },
  ];
  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  function validation() {
    let valid = validateUsername(name);
    if (valid !== "") {
      return valid;
    }
    valid = validateEmail(email);
    if (valid !== "") {
      return valid;
    }
    valid = validatePhoneNumber(mobileNumber);
    if (valid !== "") {
      return valid;
    }
    valid = validateAdddress(address);
    if (valid !== "") {
      return valid;
    }
    valid = validateBranchId(branch);
    if (valid !== "") {
      return valid;
    }
    valid = validatePassword(password);
    if(valid != "") {
      return valid;
    }
    if(password != conPassword) {
      return "Password - Mismatch";
    }
    return "";
  }

  const submitReport = async (e) => {
    e.preventDefault();
    let valid = await validation();
    if (valid !== "") {
      setOpen(true);
      setSeverity("warning");
      setMessage(valid);
      return;
    } else {
      axios
        .post("/check-username", {
          username: name,
          email: email,
          mobileNumber: mobileNumber,
        })
        .then((response) => {
          if (response.data.status === "success") {
            setIsLoading(true);
            axios
              .post("/post-new-manager", {
                username: name,
                email: email,
                branch: branch,
                address: address,
                mobileNumber: mobileNumber,
                password:password,
                conPassword: conPassword,
              })
              .then((resp) => {
                setOpen(true);
                setSeverity(resp.data.status);
                setMessage(resp.data.message);

                if (resp.data.status === "success") {
                  setTimeout(() => {
                    setIsLoading(false);
                    props.addCustomerStatus(false);
                  }, 3000);
                } else {
                  setIsLoading(false);
                }
              })
              .catch((err) => {
                setIsLoading(false);
                setOpen(true);
                setSeverity("error");
                setMessage("Something went wrong");
                return;
              });
          } else {
            setOpen(true);
            setSeverity(response.data.status);
            setMessage(response.data.message);
          }
        })
        .catch((err) => {
          setOpen(true);
          setSeverity("error");
          setMessage("Something went wrong");
          return;
        });
    }
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div className="new-customer">
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          marginBottom: "20px",
          backgroundColor: "white",
          width: "1560px",
          height: "810px",
          color: "Black",
        }}
      >
        <Button
          style={{
            marginBottom: "10px",
            marginTop: "20px",
            right: -450,
            backgroundColor: "purple",
          }}
          variant="contained"
          onClick={() => props.addCustomerStatus(false)}
        >
          Back
        </Button>
        <div className="main-title">
          <h2 style={{ color: "black", paddingTop: "20px" }}>New Manager</h2>
        </div>
        <div className="main-form">
          <form name="event" style={{ verticalAlign: "middle", gap: "10px" }}>
            {Fields.map((field) => (
              <div key={field.id}>
                {(field.type === "text" ||
                  field.type === "number" ||
                  field.type === "date" ||
                  field.type === "email" || field.type === "password") && (
                  <TextField
                    style={{ margin: "10px", width: "20rem" }}
                    type={field.type}
                    label={field.labelName}
                    disabled={field.status === "disabled"}
                    variant="outlined"
                    onChange={(e) => updateValues(e, field.id)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                )}
                {field.type === "select" && (
                  <FormControl style={{ margin: "10px", width: "20rem" }}>
                    <InputLabel id="demo-simple-select-label">
                      {field.labelName}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={field.labelName}
                      onChange={(e) => updateValues(e, field.id)}
                      required
                    >
                      {field.select.map((selectValue) => (
                        <MenuItem value={selectValue}>{selectValue}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <br />
              </div>
            ))}

            <Button
              style={{
                marginBottom: "20px",
                marginTop: "20px",
                backgroundColor: "purple",
              }}
              disabled={isLoading}
              variant="contained"
              onClick={(e) => submitReport(e)}
            >
              {isLoading && (
                <CircularProgress style={{ marginRight: "10px" }} size={20} />
              )}
              Add Manager
            </Button>
          </form>
        </div>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

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
  validateAadhar,
} from "../../Validations/validations";

export default function MedicinePageManager() {
  const [pageStatus, setPageStatus] = useState(false);
  const changeStatus = (val) => {
    setPageStatus(val);
  };
  const getPage = () => {
    switch (pageStatus) {
      case true:
        return <AddDeliveryManPage addDeliveryManStatus={changeStatus} />;
      default:
        return <DeliveryManPage addDeliveryManStatus={changeStatus} />;
    }
  };
  return <>{getPage()}</>;
}

function DeliveryManPage(props) {
  const [deliveryMan, setDeliveryMan] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let temp = [];
    let counter = 0;
    axios
      .post("/get-delivery-men-details", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        setDeliveryMan(resp.data);
        resp.data.forEach((data) => {
          temp.push({
            id: ++counter,
            name: data.name,
            email: data.email,
            mobilenumber: data.mobileNumber,
            address: data.address,
            aadhar: data.aadhar,
          });
        });
        setDataGridRows(temp);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(false);
        console.log("Error fetching details...");
      });
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Delivery Man Name", width: 180 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "mobilenumber", headerName: "Mobile Number", width: 130 },
    { field: "address", headerName: "Address", width: 300 },
    { field: "aadhar", headerName: "Aadhar", width: 130 },
  ];
  return (
    <Paper
      elevation={3}
      style={{
        textAlign: "right",
        alignSelf: "center",
        margin: "auto",
        backgroundColor: "white",
        width: "1135px",
        height: "600px",
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
        onClick={() => props.addDeliveryManStatus(true)}
      >
        Add Delivery Man
      </Button>
      <DataGrid
        style={{
          alignSelf: "center",
          width: "1000px",
          height: "500px",
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

function AddDeliveryManPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");

  const updateValues = (e, fieldId) => {
    switch (fieldId) {
      case 1:
        setName(e.target.value);
        break;
      case 2:
        setEmail(e.target.value);
        break;
      case 3:
        setMobileNumber(e.target.value);
        break;
      case 4:
        setAddress(e.target.value);
        break;
      case 5:
        setAadhar(e.target.value);
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
      labelName: "Delivery Man Username",
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
      fieldName: "mobilenumber",
      labelName: "Mobile Number",
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
      fieldName: "aadhar",
      labelName: "Aadhar Number",
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
    valid = validateAadhar(aadhar);
    if (valid !== "") {
      return valid;
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
              .post("/post-delivery-man-details", {
                name: name,
                email: email,
                mobileNumber: mobileNumber,
                address: address,
                aadhar: aadhar,
                secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
              })
              .then((resp) => {
                setOpen(true);
                setSeverity(resp.data.status);
                setMessage(resp.data.message);
                if (resp.data.status === "success") {
                  setTimeout(() => {
                    setIsLoading(false);
                    props.addDeliveryManStatus(false);
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
          width: "1135px",
          minHeight: "600px",
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
          onClick={() => props.addDeliveryManStatus(false)}
        >
          Back
        </Button>
        <div className="main-title">
          <h2 style={{ color: "black", paddingTop: "20px" }}>
            New Delivery Man
          </h2>
        </div>
        <div className="main-form">
          <form name="event" style={{ verticalAlign: "middle", gap: "10px" }}>
            {Fields.map((field) => (
              <div key={field.id}>
                {(field.type === "text" ||
                  field.type === "number" ||
                  field.type === "email" ||
                  field.type === "date") && (
                  <TextField
                    key={field.id}
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
              Add Delivery Man
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

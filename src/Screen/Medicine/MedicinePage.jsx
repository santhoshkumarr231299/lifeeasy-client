import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, Paper, CircularProgress, Fab } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Cookies from "js-cookie";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import {
  validateMedicineName,
  validateMedCompanyName,
} from "../../Validations/validations";

export default function MedicinePageManager({ theme }) {
  const [isAddMedClicked, setAddMedClicked] = useState(false);
  const changeStatus = (val) => {
    setAddMedClicked(val);
  };
  const getMedPage = () => {
    switch (isAddMedClicked) {
      case true:
        return <AddMedicinePage theme={theme} addMedStatus={changeStatus} />;
      default:
        return <MedicinePage theme={theme} addMedStatus={changeStatus} />;
    }
  };
  return <>{getMedPage()}</>;
}

function MedicinePage(props) {
  const [dataGridRows, setDataGridRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let temp = [];
    let counter = 1;
    axios
      .post("/get-medicines")
      .then((resp) => {
        resp.data.forEach((med) => {
          temp.push({
            id: counter++,
            mid: med.mid,
            mname: med.mname,
            mcompany: med.mcompany,
            quantity: med.quantity,
            dateadded:
              "Date:" +
              med.dateAdded.substring(0, 10) +
              " Time:" +
              med.dateAdded.substring(11, 16),
            expirydate: med.expiryDate.substring(0, 10),
            mrp: med.medMrp,
            rate: med.medRate,
            status: med.status,
            addedby: med.addedBy,
          });
        });

        setDataGridRows(temp);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("Error fetching medicines...");
      });
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "mname", headerName: "Medicine Name", width: 130 },
    { field: "mcompany", headerName: "Company Name", width: 130 },
    { field: "quantity", headerName: "Quantity", width: 70 },
    { field: "dateadded", headerName: "Date Added", width: 130 },
    { field: "expirydate", headerName: "Expiry Date", width: 130 },
    { field: "mrp", headerName: "MRP", width: 70 },
    { field: "rate", headerName: "Rate", width: 70 },
    { field: "addedby", headerName: "Added By", width: 100 },
    { field: "status", headerName: "Status", width: 85 },
  ];
  return (
    <Paper
      elevation={3}
      style={{
        textAlign: "right",
        alignSelf: "center",
        margin: "auto",
        backgroundColor: props.theme.background,
        width: "1560px",
        height: "810px",
      }}
    >
      <Button
        style={{
          marginBottom: "20px",
          marginTop: "20px",
          marginRight: "15px",
          position: "",
          right: 50,
          backgroundColor: props.theme.others,
        }}
        variant="contained"
        onClick={() => props.addMedStatus(true)}
      >
        Add Medicine
      </Button>
      <DataGrid
        style={{
          alignSelf: "center",
          width: "1460px",
          height: "710px",
          margin: "auto",
          color: props.theme.fontColor
        }}
        loading={isLoading}
        rows={dataGridRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowHeight={() => "auto"}
      />
    </Paper>
  );
}

function AddMedicinePage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [medName, setMedName] = useState("");
  const [medCompany, setMedCompany] = useState("");
  const [medExpiryDate, setMedExpiryDate] = useState("");
  const [medQuantity, setMedQuantity] = useState("");
  const [medMrp, setMedMrp] = useState("");
  const [medRate, setMedRate] = useState("");
  const [medStatus, setMedStatus] = useState("");
  const [formData, setFormData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const updateValues = (e, fieldId) => {
    switch (fieldId) {
      case 1:
        setMedName(e.target.value);
        break;
      case 2:
        setMedCompany(e.target.value);
        break;
      case 3:
        setMedMrp(e.target.value);
        break;
      case 4:
        setMedRate(e.target.value);
        break;
      case 5:
        setMedQuantity(e.target.value);
        break;
      case 6:
        setMedExpiryDate(e.target.value);
        break;
      case 7:
        setMedStatus(e.target.value);
        break;
      default:
        console.log("Not Valid");
        break;
    }
  };

  const medicineFields = [
    {
      id: 0,
      type: "file",
      fieldName: "medpic",
      labelName: "Medicine Picture",
      status: "active",
    },
    {
      id: 1,
      type: "text",
      fieldName: "medname",
      labelName: "Medicine Name",
      status: "active",
    },
    {
      id: 2,
      type: "text",
      fieldName: "medcompany",
      labelName: "Medicine Company",
      status: "active",
    },
    {
      id: 3,
      type: "number",
      fieldName: "medmrp",
      labelName: "MRP",
      status: "active",
    },
    {
      id: 4,
      type: "number",
      fieldName: "medrate",
      labelName: "Rate",
      status: "active",
    },
    {
      id: 5,
      type: "number",
      fieldName: "medquantity",
      labelName: "Quantity",
      status: "active",
    },
    {
      id: 6,
      type: "date",
      fieldName: "medexpirydate",
      labelName: "Expiry Date",
      status: "active",
    },
    {
      id: 7,
      type: "select",
      select: ["ACTIVE", "INACTIVE"],
      fieldName: "medstatus",
      labelName: "Status",
      status: "active",
    },
  ];
  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  function validation() {
    let valid = validateMedicineName(medName);
    if (valid !== "") {
      return valid;
    }
    valid = validateMedCompanyName(medCompany);
    if (valid !== "") {
      return valid;
    }
    return "";
  }

  const submitReport = async (e) => {
    e.preventDefault();
    let valid = validation();
    if (valid !== "") {
      setOpen(true);
      setSeverity("warning");
      setMessage(valid);
      return;
    } else {
      setIsLoading(true);
      axios
        .post("/post-medicine", {
          medName: medName,
          medCompany: medCompany,
          medMrp: medMrp,
          medRate: medRate,
          medQuantity: medQuantity,
          medExpiryDate: medExpiryDate,
          medStatus: medStatus,
          secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
        })
        .then(async (resp) => {
          setOpen(true);
          setSeverity(resp.data.status);
          setMessage(resp.data.message);

          if (resp.data.status === "success") {
            await uploadImage(resp.data.id);
            setTimeout(() => {
              setIsLoading(false);
              props.addMedStatus(false);
            }, 1000);
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
    }
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const uploadImage = async (id) => {
    return new Promise(async (resolve, reject) => {
      if(formData) {
        await axios.post("/medicine/upload?mid=" + id, formData, {
          headers : {
            "Content-Type": "multipart/form-data",
          }
        }).then((response) => {
          resolve();
        }).catch(e => {
          resolve();
        })
      }
    })
  }

  const FileUpload = () => {
    const handleFileUpload = (event) => {
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

        <Fab
          color="secondary"
          size="small"
          component="span"
          aria-label="add"
          variant="extended"
          style={{
            backgroundColor: props.theme.others
          }}
        >
        { selectedImage == "" ? <AddIcon /> : <RemoveIcon />} { selectedImage == "" ? "Upload Image" : selectedImage}
        </Fab>
      </label>
    );
  }
  return (
    <div className="new-customer">
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          marginBottom: "20px",
          backgroundColor: props.theme.background,
          width: "1560px",
          height: "auto",
        }}
      >
        <Button
          style={{
            marginBottom: "10px",
            marginTop: "20px",
            right: -450,
            backgroundColor: props.theme.others,
          }}
          variant="contained"
          onClick={() => props.addMedStatus(false)}
        >
          Back
        </Button>
        <div className="main-title">
          <h2 style={{ color: props.theme.fontColor, paddingTop: "20px" }}>New Medicine</h2>
        </div>
        <div className="main-form">
          <form name="event" style={{ verticalAlign: "middle", gap: "10px" }}>
            {medicineFields.map((med) => (
              <div key={med.id}>
                {(med.type === "text" ||
                  med.type === "number" ||
                  med.type === "date") && (
                  <TextField
                    color="secondary"
                    style={{ margin: "10px", width: "20rem" }}
                    type={med.type}
                    label={med.labelName}
                    disabled={med.status === "disabled"}
                    variant="outlined"
                    onChange={(e) => updateValues(e, med.id)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                )}
                {med.type === "select" && (
                  <FormControl style={{ margin: "10px", width: "20rem" }}>
                    <InputLabel id="demo-simple-select-label">
                      {med.labelName}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={med.labelName}
                      onChange={(e) => updateValues(e, med.id)}
                      required
                    >
                      {med.select.map((selectValue) => (
                        <MenuItem key={selectValue} value={selectValue}>
                          {selectValue}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {med.type === "file" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {FileUpload()}
                  </div>
                )}
                <br />
              </div>
            ))}

            <Button
              style={{
                marginBottom: "20px",
                marginTop: "20px",
                backgroundColor: props.theme.others,
              }}
              variant="contained"
              onClick={(e) => submitReport(e)}
              disabled={isLoading}
            >
              {isLoading && (
                <CircularProgress style={{ marginRight: "10px" }} size={20} />
              )}
              Add Medicine
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

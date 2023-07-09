import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, Paper, CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";
import { validateReports } from "../../Validations/validations";

export default function ReportPageManager() {
  const [isAddMedClicked, setAddMedClicked] = useState(false);
  const changeStatus = (val) => {
    setAddMedClicked(val);
  };
  const getMedPage = () => {
    switch (isAddMedClicked) {
      case true:
        return <AddReportPage addMedStatus={changeStatus} />;
      default:
        return <ReportPage addMedStatus={changeStatus} />;
    }
  };
  return <>{getMedPage()}</>;
}

function ReportPage(props) {
  const [dataGridRows, setDataGridRows] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let temp = [];
    axios
      .post("/get-reports", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        resp.data.forEach((tdata) => {
          temp.push({
            id: tdata.id,
            title: tdata.reportTitle,
            subject: tdata.reportSubject,
            description: tdata.reportDesc,
            date: tdata.reportDate.substring(0, 10),
            role: tdata.role,
            reporter: tdata.reportedBy,
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
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", width: 130 },
    { field: "subject", headerName: "Subject", width: 130 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "reporter", headerName: "Reported By", width: 130 },
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
          marginTop: "10px",
          marginRight: "15px",
          right: 50,
          backgroundColor: "purple",
        }}
        variant="contained"
        onClick={() => props.addMedStatus(true)}
      >
        Add Report
      </Button>
      <DataGrid
        style={{
          alignSelf: "center",
          width: "1460px",
          height: "710px",
          margin: "auto",
        }}
        loading={isLoading}
        rows={dataGridRows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowHeight={() => 'auto'}
      />
    </Paper>
  );
}

function AddReportPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");

  const reportFields = [
    { id: 1, fieldName: "title", labelName: "Report Title", status: "active" },
    {
      id: 2,
      fieldName: "subject",
      labelName: "Report subject",
      status: "active",
    },
    {
      id: 3,
      fieldName: "desc",
      labelName: "Report Description",
      status: "active",
    },
  ];

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  const updateValues = (e, fieldId) => {
    switch (fieldId) {
      case 1:
        setTitle(e.target.value);
        break;
      case 2:
        setSubject(e.target.value);
        break;
      case 3:
        setDesc(e.target.value);
        break;
      default:
        console.log("Not Valid");
    }
  };

  function validation() {
    let valid = validateReports("Title", title, 10, 50);
    if (valid !== "") {
      return valid;
    }
    valid = validateReports("Subject", subject, 20, 200);
    if (valid !== "") {
      return valid;
    }
    valid = validateReports("Description", desc, 50, 500);
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
      setIsLoading(true);
      axios
        .post("/post-report", {
          reportTitle: title.trim(),
          reportSubject: subject.trim(),
          reportDesc: desc.trim(),
          secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
        })
        .then((resp) => {
          setOpen(true);
          setSeverity(resp.data.status);
          setMessage(resp.data.message);
          if (resp.data.status === "success") {
            setTimeout(() => {
              setIsLoading(false);
              props.addMedStatus(false);
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
          minHeight: "810px",
          color: "Black",
        }}
      >
        <Button
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            right: -450,
            backgroundColor: "purple",
          }}
          variant="contained"
          onClick={() => props.addMedStatus(false)}
        >
          Back
        </Button>
        <div className="main-title">
          <h2 style={{ color: "black", paddingTop: "20px" }}>New Report</h2>
        </div>
        <div className="main-form">
          <form name="event" style={{ verticalAlign: "middle", gap: "10px" }}>
            {reportFields.map((report) => (
              <div key={report.id}>
                <TextField
                  style={{ margin: "10px", width: "400px" }}
                  label={report.labelName}
                  disabled={report.status === "disabled"}
                  variant="outlined"
                  onChange={(e) => updateValues(e, report.id)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline={true}
                  required
                />
                <br />
              </div>
            ))}

            <Button
              onClick={(e) => submitReport(e)}
              style={{
                marginBottom: "20px",
                marginTop: "20px",
                backgroundColor: "purple",
              }}
              variant="contained"
              disabled={isLoading}
            >
              {isLoading && (
                <CircularProgress style={{ marginRight: "10px" }} size={20} />
              )}
              Add Report
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

import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, Paper, LinearProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";

export default function MedicinePageManager() {
  const [pageStatus, setPageStatus] = useState(false);
  const changeStatus = (val) => {
    setPageStatus(val);
  };
  const getPage = () => {
    switch (pageStatus) {
      case true:
        return <YourDeliveryPage changeButtonStatus={changeStatus} />;
      default:
        return <OrderPickupPage changeButtonStatus={changeStatus} />;
    }
  };
  return <>{getPage()}</>;
}

function OrderPickupPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [orderedItems, setOrderedItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  const approveItems = (e) => {
    e.preventDefault();
    selectedItems.forEach((item) => {
      let userM = dataGridRows.filter((ele) => ele.id === item)[0];
      axios
        .post("/pickup-order", {
          username: userM.name,
          medName: userM.mname,
          secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
        })
        .then((resp) => {
          setOpen(true);
          setSeverity(resp.data.status);
          setMessage(resp.data.message);
          if (resp.data.status === "success") {
            fetchData();
          }
        })
        .catch((err) => {
          setOpen(true);
          setSeverity("error");
          setMessage("Something went wrong");
          return;
        });
    });
  };

  function fetchData() {
    setIsLoading(true);
    let temp = [];
    let counter = 0;
    axios
      .post("/get-approved-items", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        setOrderedItems(resp.data);
        resp.data.forEach((data) => {
          temp.push({
            id: ++counter,
            name: data.username,
            mname: data.mname,
            quantity: data.quantity,
            mobilenumber: data.mobileNumber,
          });
        });
        setDataGridRows(temp);
        setIsLoading(false)
      }).catch(err => {
        console.log("Error fetching details...");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "mname", headerName: "Medicine Name", width: 180 },
    { field: "quantity", headerName: "Quantity", width: 70 },
    { field: "mobilenumber", headerName: "Mobile Number", width: 130 },
  ];

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div>
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
        <div
          style={{
            alignItems: "center",
          }}
        >
          <Button
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              marginRight: "20px",
              right: 65,
              backgroundColor: "purple",
            }}
            variant="contained"
            onClick={(e) => props.changeButtonStatus(true)}
          >
            Your Delivery
          </Button>

          <Button
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              marginRight: "20px",
              right: 65,
              backgroundColor: "green",
            }}
            variant="contained"
            onClick={(e) => approveItems(e)}
          >
            {selectedItems && selectedItems.length <= 1
              ? "Pick Up"
              : "Pick Up All"}
          </Button>
        </div>
        <DataGrid
          loading={isLoading}
          style={{
            alignSelf: "center",
            width: "1000px",
            height: "500px",
            margin: "auto",
          }}
          getRowHeight={() => 'auto'}
          rows={dataGridRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(item) => setSelectedItems(item)}
        />
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function YourDeliveryPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  function fetchData() {
    setIsLoading(true);
    let temp = [];
    let counter = 0;
    axios
      .post("/get-orders", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        setOrders(resp.data);
        resp.data.forEach((data) => {
          temp.push({
            id: ++counter,
            name: data.username,
            mname: data.mname,
            quantity: data.quantity,
            mobilenumber: data.mobileNumber,
          });
        });
        setDataGridRows(temp);
        setIsLoading(false);
      }).catch(err => {
        console.log("Error fetching details...");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "mname", headerName: "Medicine Name", width: 180 },
    { field: "quantity", headerName: "Quantity", width: 70 },
    { field: "mobilenumber", headerName: "Mobile Number", width: 130 },
  ];

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div>
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
        <div
          style={{
            alignItems: "center",
          }}
        >
          <Button
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              marginRight: "20px",
              right: 65,
              backgroundColor: "purple",
            }}
            variant="contained"
            onClick={(e) => props.changeButtonStatus(false)}
          >
            Back
          </Button>
        </div>
        <DataGrid
          loading={isLoading}
          style={{
            alignSelf: "center",
            width: "1000px",
            height: "500px",
            margin: "auto",
          }}
          getRowHeight={() => 'auto'}
          rows={dataGridRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(item) => console.log(item)}
        />
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Paper } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";

export default function PharmacistPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataGridRows, setDataGridRows] = useState([]);

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };
  const declineItems = (e) => {
    e.preventDefault();
    selectedItems.forEach((item) => {
      let userM = dataGridRows.filter((ele) => ele.id === item)[0];
      axios
        .post("/decline-orders", {
          username: userM.name,
          mname: userM.mname,
          mid: userM.mid,
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

  const approveItems = (e) => {
    e.preventDefault();
    selectedItems.forEach((item) => {
      let userM = dataGridRows.filter((ele) => ele.id === item)[0];
      axios
        .post("/approve-order", {
          username: userM.name,
          mname: userM.mname,
          mid: userM.mid,
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
      .post("/get-ordered-items-for-approval", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        resp.data.forEach((data) => {
          temp.push({
            id: ++counter,
            mid: data.mid,
            name: data.username,
            mname: data.mname,
            quantity: data.quantity,
          });
        });
        setIsLoading(false);
        setDataGridRows(temp);
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
          width: "1560px",
          height: "810px",
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
              backgroundColor: "green",
            }}
            variant="contained"
            onClick={(e) => approveItems(e)}
          >
            {selectedItems && selectedItems.length <= 1
              ? "Approve"
              : "Approve All"}
          </Button>
          <Button
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              right: 65,
              backgroundColor: "red",
            }}
            variant="contained"
            onClick={(e) => declineItems(e)}
          >
            {selectedItems && selectedItems.length <= 1
              ? "Decline"
              : "Decline All"}
          </Button>
        </div>
        <DataGrid
          loading={isLoading}
          style={{
            alignSelf: "center",
            width: "1460px",
            height: "710px",
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

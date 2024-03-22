import React from "react";
// import axios from "../../api/axios";
import { useState } from "react";
// import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
// import Cookies from "js-cookie";

export default function SalesReportPage(props) {
  const [dataGridRows] = useState([]);
  // useEffect(() => {
  //   let temp = [];
  //   let counter = 0;
    // axios.get("http://localhost:3000/get-medicines").then((resp) => {
    //   resp.data.forEach((da) => {
    //     temp.push({ id: ++counter, mname: da.mname, mcompany: da.mcompany });
    //   });
    //   setDataGridRows(temp);
    // });
  // }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Sales Report Title", width: 130 },
    { field: "type", headerName: "Sales Report Type", width: 130 },
    { field: "date", headerName: "Date", width: 70 },
    { field: "reporter", headerName: "Sales Reported By", width: 130 },
  ];
  return (
    <Paper
      elevation={3}
      style={{
        backgroundColor: props.theme.background,
        width: "1560px",
        height: "810px",
      }}
    >
      <div>
        <div style={{ paddingTop: "50px" }}></div>
        <DataGrid
          style={{
            justifyContent: "center",
            verticalAlign: "center",
            width: "1460px",
            height: "710px",  
            margin: "auto",
            color: props.theme.fontColor
          }}
          getRowHeight={() => 'auto'}
          rows={dataGridRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Paper>
  );
}

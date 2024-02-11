import React from "react";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function CommonReport(props: any) {
  const PaperStyle = {
    margin: "auto",
    backgroundColor: "white",
    width: "1560px",
    height: "810px",
    color: "Black",
  };
  return (
    <div>
      <Paper style={PaperStyle} elevation={3}>
        <CommonReportUI {...props} />
      </Paper>
    </div>
  );
}

function CommonReportUI(props: any) {
  return <DataGrid {...props} />;
}

export default CommonReport;

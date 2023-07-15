import React, { useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

function ExecuteSql() {
  const [query, setQuery] = useState<string>("");

  const navigate = useNavigate();

  const executeSql = () => {
    axios
      .post(process.env.REACT_APP_SUPER_BASE_API + "/execute", {
        query: query,
      })
      .then((resp) => {
          console.log(resp);
      }).catch((error) => {
          navigate("/login");
      });
  };

  const bodyStyle: any = {
    
  };

  const textAreaStyle = {
    marginLeft: "20px",
    marginTop : "20px"
  };

  const buttonStyle = {
    marginLeft: "20px",
  };

  const dataStyle = {};

  return (
    <div style={bodyStyle}>
      <textarea
        style={textAreaStyle}
        cols={100}
        rows={10}
        onChange={(e) => setQuery(e.target.value)}></textarea>
      <br />
      <button style={buttonStyle} onClick={() => executeSql()}>
        Execute Query
      </button>
      <div style={dataStyle}></div>
    </div>
  );
}

export default ExecuteSql;

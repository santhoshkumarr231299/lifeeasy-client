import React, { useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

function ExecuteSql() {
  const [columns, setColumns] = useState<string[]>([]);
  const [datas, setDatas] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  let counter = 0;

  const navigate = useNavigate();

  const executeSql = () => {
    axios
      .post(process.env.REACT_APP_SUPER_BASE_API + "/execute", {
        query: query,
      })
      .then((resp) => {
        setDatas(resp.data.data);
        setColumns([]);
        if (resp.data.data && resp.data.data.length > 0) {
          Object.entries(resp.data.data[0]).forEach((element) => {
            setColumns((prev) => [...prev, element[0]]);
          });
        }
      })
      .catch((error) => {
        navigate("/login");
      });
  };

  const bodyStyle: any = {};

  const textAreaStyle: any = {
    marginLeft: "20px",
    marginTop: "20px",
  };

  const buttonStyle: any = {
    marginLeft: "20px",
  };

  const dataStyle: any = {
    backgroundColor: "white",
    border: "",
  };

  const tableBorderStyle: any = {
    border: "1px solid",
  };

  const tableInnerTextStyle: any = {
    margin: "5px",
  };

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
      <div style={dataStyle}>
        <table style={tableBorderStyle}>
          <tr style={tableBorderStyle}>
            {columns.map((col) => (
              <td key={col} style={tableBorderStyle}>
                <div style={tableInnerTextStyle} style={{ fontWeight: "bold" }}>
                  {col}
                </div>
              </td>
            ))}
          </tr>
          {datas.map((data) => (
            <tr key={counter++} style={tableBorderStyle}>
              {columns.map((col) => (
                <td key={col} style={tableBorderStyle}>
                  <div style={tableInnerTextStyle}>{data[col]}</div>
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default ExecuteSql;

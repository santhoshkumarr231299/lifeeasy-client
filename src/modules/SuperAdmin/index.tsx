import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ExecuteSql from "./Screen/ExecuteSql.tsx";
import PageNotFound from "../errorpages/404.tsx";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const checkAuth = () => {
    axios
      .post(process.env.REACT_APP_SUPER_BASE_API + "/auth")
      .then((resp) => {})
      .catch((error) => {
        navigate("/login");
      });
  };

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/execute" element={<ExecuteSql />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;

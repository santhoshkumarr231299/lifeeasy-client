import React, { Component, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";

const MainPage = lazy(() => import("./Screen/MainPage/MainPage"));
const LoginPage = lazy(() => import("./Screen/LoginPage/LoginPage"));
const NewUser = lazy(() => import("./Screen/NewUserPage/NewUserPage"));
const ForgotPassPage = lazy(() => import("./Screen/ForgotPass/ForgotPass"));

class App extends Component {
  theme = {
    color : "white",
    bgColor : "purple",
  }
  render() {
    return (
      <div className="App">
        <Suspense fallback={<CircularProgress />}>
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/home" element={<MainPage theme = {this.theme} />} />
                <Route path="/login" element={<LoginPage theme = {this.theme} />} />
                <Route path="/newuser" element={<NewUser theme = {this.theme} />} />
                <Route path="/forgotpass" element={<ForgotPassPage  theme = {this.theme} />} />
            </Routes>
        </BrowserRouter>
    </Suspense>
      </div>
    );
  }
}

export default App;


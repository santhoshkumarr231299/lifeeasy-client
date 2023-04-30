import React, { Component, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import LoginPage from './Screen/LoginPage/LoginPage';
import NewUser from './Screen/NewUserPage/NewUserPage';
import ForgotPassPage from './Screen/ForgotPass/ForgotPass';
import SubscribeToServicePage from "./Screen/SubscribeToServicePage/SubscribeToServicePage"
import SuperMainPage from "./modules/SuperAdmin/Screen/MainPage.tsx";
import Cookies from 'js-cookie';

const MainPage = lazy(() => import("./Screen/MainPage/MainPage"));

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
                <Route path="/home" element={!Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) ? <Navigate to="/login" /> : <MainPage theme = {this.theme} />} />
                <Route path="/login" element={Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) ? <Navigate to="/home" /> : <LoginPage theme = {this.theme} />} />
                <Route path="/newuser" element={Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) ? <Navigate to="/home" /> : <NewUser theme = {this.theme} />} />
                <Route path="/forgotpass" element={Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) ? <Navigate to="/home" /> : <ForgotPassPage  theme = {this.theme} />} />
                <Route path='/subscribe' element={<SubscribeToServicePage />} />
                <Route path='/super-admin' element={<SuperMainPage />} />
                <Route path='/*' element={<h1>Page Not Found 404</h1>} />
            </Routes>
        </BrowserRouter>
    </Suspense>
      </div>
    );
  }
}

export default App;


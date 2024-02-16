import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import LoginPage from "./Screen/LoginPage/LoginPage";
import NewUser from "./Screen/NewUserPage/NewUserPage";
import ForgotPassPage from "./Screen/ForgotPass/ForgotPass";
import SubscribeToServicePage from "./Screen/SubscribeToServicePage/SubscribeToServicePage";
import NotFoundPage from "./modules/errorpages/404.tsx";
import SuperMainPage from "./modules/SuperAdmin/index.tsx";
import Cookies from "js-cookie";
// import BackgroundImage from "./assets/background.jpg";

const MainPage = lazy(() => import("./Screen/MainPage/MainPage"));

class App extends Component {
  componentDidMount() {
    document.title =
      process.env.REACT_APP_PRODUCT_FIRST_NAME +
      process.env.REACT_APP_PRODUCT_LAST_NAME;
  }
  render() {
    return (
      <div className="App">
        {/* <div className="background-img">
          <img src={BackgroundImage} height="1075vh" width="100%" loading="lazy" />
        </div> */}
        {/* <div className="main"> */}
          <Suspense fallback={<CircularProgress />}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route
                  path="/home"
                  element={
                    !Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) && !localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS) ? (
                      <Navigate to="/login" />
                    ) : (
                      <MainPage theme={this.theme} />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) && localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS) ? (
                      <Navigate to="/home" />
                    ) : (
                      <LoginPage theme={this.theme} />
                    )
                  }
                />
                <Route
                  path="/newuser"
                  element={
                    Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) && localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS) ? (
                      <Navigate to="/home" />
                    ) : (
                      <NewUser theme={this.theme} />
                    )
                  }
                />
                <Route
                  path="/forgotpass"
                  element={
                    Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY) && localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS) ? (
                      <Navigate to="/home" />
                    ) : (
                      <ForgotPassPage theme={this.theme} />
                    )
                  }
                />
                <Route path="/subscribe" element={<SubscribeToServicePage />} />
                <Route path="/super-admin/*" element={<SuperMainPage />} />
                <Route path="/*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </Suspense>
        {/* </div> */}
      </div>
    );
  }
}

export default App;

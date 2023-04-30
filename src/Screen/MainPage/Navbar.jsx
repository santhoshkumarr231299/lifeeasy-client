import React, { useState } from "react";
import { autocompleteClasses, Avatar } from "@mui/material";
import { purple } from "@mui/material/colors";
import { Settings, Logout } from "@mui/icons-material";
import logo from "../../assets/logo.png";

export default function Navbar(props) {
  return (
    <nav className="navbar navbar-light bg-light">
      <a
        style={{
          display: "flex",
          // gap: "2rem",
          alignItems: "center",
          marginLeft: "15px",
          justifyContent: "space-between",
          width: '100%'
        }}
      >
        <div
          className="main-title"
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={logo}
              style={{
                margin: 0,
                padding: 0,
              }}
            />
          </div>
          <div
            style={{
              width: "200px",
            }}
          >
            <h6
              className="pharm-name"
              style={{ margin: 0, padding: 0, letterSpacing: "0em" }}
            >
              {props.pharmacy.toUpperCase()}
            </h6>
            <span
              className="favicon"
              style={{
                // fontSize: "10px",
                margin: 0,
                padding: 0,
                fontFamily: "Trebuchet MS, sans-serif",
              }}
            >
              <div className="app-name">
                <div className="app-name-first">Pharm</div>
                <div className="app-name-second">Simple</div>
              </div>
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginRight:'15px'
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: purple[500] }}>
              {props.username[0].toUpperCase()}
            </Avatar>
            Hello{" "}
            {props.username[0].toUpperCase() + props.username.substring(1)}
          </div>
          <div onClick={(e) => props.changeOption(e, 999)}>
            <Settings className="icon-top" />
          </div>
          <div onClick={(e) => props.changeOption(e, 1000)}>
            <Logout className="icon-top" />
          </div>
        </div>
      </a>
    </nav>
  );
}

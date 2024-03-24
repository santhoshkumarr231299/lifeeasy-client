import React, { useState } from "react";
import {  Avatar } from "@mui/material";
import { purple } from "@mui/material/colors";
import { Settings, Logout } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Navbar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e, pageId) => {
    if(pageId) {
      props.changeOption(e, pageId);
    }
    setAnchorEl(null);
  };
  return (
    <nav className="navbar navbar-light bg-light"
      style={{
        backgroundColor : props.theme.backgroundColor,
        color: props.theme.fontColor
      }}
    >
      <div
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
              alt=""
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
                <div className="app-name-first">{process.env.REACT_APP_PRODUCT_FIRST_NAME}</div>
                <div className="app-name-second">{process.env.REACT_APP_PRODUCT_LAST_NAME}</div>
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
          <div onClick={handleClick}>
            <Settings className="icon-top" />
          </div>
          <div onClick={(e) => props.changeOption(e, 1000)}>
            <Logout className="icon-top" />
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={e => handleClose(e, null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={e => handleClose(e, 999)}>My Account</MenuItem>
        <MenuItem onClick={e => handleClose(e, 998)}>Theme Settings</MenuItem>
      </Menu>
    </nav>
  );
}

import React, { useState } from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import {  Avatar } from "@mui/material";
import { purple } from "@mui/material/colors";

export default function ChatSideBar() {
    const [selectedUser, setSelectedUser] = useState<number>(1);
    const menus = [
        { menuValue : 1, name : 'santhosh'},
    ]
    return (
        <React.Fragment>
            <ListGroup>
            {menus.map(
              (menu) =>
                (
                  <ListGroup.Item
                    key={menu.menuValue}
                    className="sidebar-items"
                    style={{
                    //   color: option === menu.menuValue ? "purple" : "",
                    //   fontWeight: option === menu.menuValue ? "bold" : "",
                    }}
                  >
                    <a
                      key={menu.menuValue}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: 'center',
                        margin: "2px 0 2px 0",
                        fontSize: 20
                      }}
                      onClick={(e) => console.log('clicked')}
                    >
                      <div>
                        <Avatar sx={{ bgcolor: purple[500], height: 40, width: 40, margin: 0, padding: 0 }}>
                        {menu.name[0].toUpperCase()}
                        </Avatar>
                      </div>
                      <div>
                        <span>{menu.name[0].toUpperCase() + menu.name.substring(1)}</span>
                      </div>
                    </a>
                  </ListGroup.Item>
                )
            )}
          </ListGroup>
        </React.Fragment>
    )
}
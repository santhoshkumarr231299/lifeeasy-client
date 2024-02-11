import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import io from "socket.io-client";
import Cookies from "js-cookie";

const socket = io(process.env.REACT_APP_BASE_URL || "", {
  extraHeaders: {
    authorization: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
  },
  transports: ["websocket", "polling", "flashsocket"],
});

function ChatWithOrganization() {
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
        <ChatUI />
      </Paper>
    </div>
  );
}

function ChatUI() {
  const headerStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  };
  const bodyStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
  };
  const chatBoxStyle = {
    border: "2px solid black",
    width: "100vh",
    height: "60vh",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  };
  const chatSideBarStyle = {
    border: "2px solid black",
    width: "25vh",
    height: "60vh",
    borderRadius: "5px",
  };
  const messageBodyStyle = {
    border: "2px solid black",
    width: "95vh",
    height: "50vh",
    borderRadius: "5px",
    margin: "auto",
  };
  const inputBoxStyle = {
    border: "2px solid black",
    width: "95vh",
    height: "8vh",
    borderRadius: "5px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  };

  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      message: message,
    });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessage(data.message);
    });
  }, [socket]);

  return (
    <React.Fragment>
      <div style={headerStyle}>
        <h4>Chat With Your Organization</h4>
      </div>
      <div style={bodyStyle}>
        <div style={chatSideBarStyle}></div>
        <div style={chatBoxStyle}>
          <div style={messageBodyStyle}>{receivedMessage}</div>
          <div style={inputBoxStyle}>
            <div>
              <textarea onChange={(e) => setMessage(e.target.value)}></textarea>
            </div>
            <div>
              <button type="button" onClick={(e) => sendMessage(e)}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ChatWithOrganization;

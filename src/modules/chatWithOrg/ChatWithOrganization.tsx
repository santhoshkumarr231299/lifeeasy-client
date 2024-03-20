import React, { useState, useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import io from "socket.io-client";
import Cookies from "js-cookie";
import "./styles/chat.css";

interface messageType {
  user : string,
  message : string,
  isSentByMe : boolean
  time : string
}

const socket = io(process.env.REACT_APP_BASE_URL_CHAT || "", {
  auth: {
    token: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY)
  },
  transports: ["websocket"],
});

function ChatWithOrganization({ username } : { username : string }) {
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
        <ChatUI username={username} />
      </Paper>
    </div>
  );
}

function ChatUI({ username }) {
  let count = 0;
  const [messages, setMessages] = useState<messageType[]>([]);
  const currentMessage = useRef();

  const sendMessage = (e : any) => {
    e.preventDefault();
    socket.emit("send_message", {
      user : username,
      message: currentMessage.current.value,
    });
    currentMessage.current.value = "";
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const message : messageType = {
        user : data.user,
        message : data.message,
        isSentByMe : data.user == username,
        time : data.time
      }
      setMessages(prev => [...prev, message]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <React.Fragment>
      <div className="chat-title">
        <h4>Chat With Organization</h4>
      </div>
      <div className="chat-body">
        <div className="chat-sidebar"></div>
        <div className="chat-box">
          <div className="chat-msg-body">
            {messages.map((message : messageType) => 
            <div key={count++}>
              {message.isSentByMe && 
                <div className="left-msg">
                  <div className="msg-img"></div>
                  <div className="msg-bubble">
                    <div className="msg-info">
                      <div className="msg-info-name">{message.user}</div>
                      <div className="msg-info-time">{message.time}</div>
                    </div>

                    <div className="msg-text">
                      {message.message}
                    </div>
                  </div>
                </div>}
            {!message.isSentByMe && 
            <div className="right-msg">
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{message.user}</div>
                  <div className="msg-info-time">{message.time}</div>
                </div>

                <div className="msg-text">
                  {message.message}
                </div>
              </div>
              <div className="msg-img"></div>
            </div>}
            </div>)}
          </div>
          <div className="msger-inputarea">
            <div>
              <input type="text" className="msger-input" placeholder="Enter your message..." ref={currentMessage} />
            </div>
            <div>
              <button type="submit" className="msger-send-btn" onClick={(e) => sendMessage(e)} >Send</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ChatWithOrganization;

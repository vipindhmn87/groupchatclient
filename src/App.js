import "./App.css";
import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:8000");
const defaultUser = {
  isLoggedIn: false,
  userName: "",
};

function App() {
  const [user, setUser] = useState(defaultUser);
  const [messages, setMessages] = useState([]);
  const [msgData, setMsgData] = useState("");

  const updateUser = (e) => {
    setUser({ isLoggedIn: user.isLoggedIn, userName: e.target.value });
  };

  const sendMessage = () => {
    const value = msgData;
    if (!value) return;
    client.send(
      JSON.stringify({
        type: "message",
        msg: value,
        user: user.userName,
      })
    );

    setMsgData("");
  };

  useEffect(() => {
    client.onopen = () => {
      console.log("client connected!");
    };

    client.onmessage = (message) => {
      const msgReceived = JSON.parse(message.data);
      if (msgReceived.type === "message") {
        const details = {
          msg: msgReceived.msg,
          user: msgReceived.user,
        };
        setMessages([...messages, details]);

        setMsgData("");
      }
    };
  }, [messages, user]);

  return (
    <div className="App">
      <div className="header">
        <p>Web Sockets</p>
        {user.isLoggedIn ? <p>User: {user.userName}</p> : <></>}
      </div>

      {user.isLoggedIn ? (
        <>
          <div className="main" style={{ overflowX: "auto", height: "75vh" }}>
            {messages.map((message, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "5px",
                }}
              >
                <div
                  style={{
                    maxWidth: 300,
                    alignSelf:
                      user.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                    background:
                      user.userName === message.user ? "cyan" : "yellow",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <div className="avatar">
                    <i>{message.user}: </i>
                  </div>
                  <div className="msg">{message.msg}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="footer">
            <div className="left">
              <input
                type="text"
                value={msgData}
                onChange={(e) => setMsgData(e.target.value)}
              ></input>
            </div>
            <div className="right">
              <button onClick={() => sendMessage()}>send</button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10%" }}>
          <div>please login</div>
          <div>
            <input type="text" onBlur={updateUser} />
            <button
              onClick={() =>
                setUser({ isLoggedIn: true, userName: user.userName })
              }
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

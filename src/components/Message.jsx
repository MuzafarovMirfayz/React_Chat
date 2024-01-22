import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Function to format the timestamp to display date and time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
        {message.file && (
          <div className="fileInfo">
            <a
              href={message.file.url}
              target="_blank"
              download={message.file.name}
              rel="noopener noreferrer"
              className="fileDownloadLink"
            >
              <p>File: {message.file.name}</p>
            </a>
          </div>
        )}
        {message.audio && (
          <div className="audioInfo">
            <audio controls>
              <source src={message.audio} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
        <span>{formatTime(message.date?.toDate())}</span>
      </div>
    </div>
  );
};

export default Message;

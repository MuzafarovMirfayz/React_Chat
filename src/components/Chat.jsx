import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";


const Chat = () => {
  const { data } = useContext(ChatContext);

  if (!data || !data.user || !data.user.uid) {
    return <div> </div>;
  }

  const {  user } = data;

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="headerChat">
          {user.photoURL == null ? (
            <h6> </h6>
          ) : (
            <img className="mirka" src={user.photoURL} alt='' />
          )}
          <span>{user.displayName}</span>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;

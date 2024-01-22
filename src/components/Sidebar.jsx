import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { signOut } from "firebase/auth";
import { auth } from '../firebase';

const Sidebar = () => {
  const divStyle = {
    overflowX: 'hidden',
    overflowY: 'scroll',
    margin: '5px',
    height: '58vh',
    weight: 'auto'
  };
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
  };

  const buttonStyle = {
    padding: '7px',
    background: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center', 
    width: '95%',
  };
  return (
    <div className="sidebar">
      <Navbar />
      <Search />

      <div style={divStyle}>
        <Chats />
      </div>
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>


    </div>
  );
};

export default Sidebar;

import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Send from "../img/send.png";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioBlob = useRef(null);
  const timerRef = useRef(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioURL(URL.createObjectURL(blob));
        audioBlob.current = blob;
        audioChunks.current = [];
      };
      mediaRecorder.current.start();
      setRecording(true);

      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      timerRef.current = timer;
      await handleSend();

    } catch (error) {
      console.error("Error starting audio recording:", error.message);
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setRecording(false);
      setRecordingDuration(0);
      clearInterval(timerRef.current);
    }
  };

  const handleSend = async () => {
    try {
      if (!text.trim() && !img && !file && !audioBlob.current) {
        return;
      }

      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Image upload error:", error.message);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await updateChatAndUserChats({
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              });
            } catch (error) {
              console.error("Image download URL error:", error.message);
            }
          }
        );
      } else if (file) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("File upload error:", error.message);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await updateChatAndUserChats({
                senderId: currentUser.uid,
                date: Timestamp.now(),
                file: {
                  name: file.name,
                  url: downloadURL,
                },
              });
            } catch (error) {
              console.error("File download URL error:", error.message);
            }
          }
        );
      } else if (audioBlob.current) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, audioBlob.current);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Voice upload error:", error.message);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await updateChatAndUserChats({
                senderId: currentUser.uid,
                date: Timestamp.now(),
                audio: downloadURL,
              });
            } catch (error) {
              console.error("Voice download URL error:", error.message);
            }
          }
        );
      } else {
        await updateChatAndUserChats({
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Message send error:", error.message);
    }
  };

  const updateChatAndUserChats = async (messageData) => {
    try {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          ...messageData,
        }),
      });

      const chatUpdate = {
        [data.chatId + ".lastMessage"]: {
          text: messageData.text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      };

      await updateDoc(doc(db, "userChats", currentUser.uid), chatUpdate);
      await updateDoc(doc(db, "userChats", data.user.uid), chatUpdate);
    } catch (error) {
      console.error("Chat or user chats update error:", error.message);
    }

    setText("");
    setImg(null);
    setFile(null);
    setAudioURL("");
    audioBlob.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImg(null);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImg(selectedFile);
      setFile(null);
    }
  };

  return (
    <div className="input">
      <input
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        value={text}
      />
      <div className="send">
        <label htmlFor="imageFile" style={{ cursor: "pointer" }}>
          <img src={Img} alt="" />
        </label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <label htmlFor="attachFile" style={{ cursor: "pointer" }}>
          <img src={Attach} alt="" />
        </label>
        <input
          type="file"
          id="attachFile"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {recording ? (
          <button onClick={handleStopRecording} className="stop-button">
            <FontAwesomeIcon icon={faStop} />
          </button>
        ) : (
          <button onClick={handleStartRecording} className="record-button">
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
        )}

        <label onClick={handleSend}>
          <img src={Send} alt="" />
        </label>
      </div>
    </div>
  );
};

export default Input;

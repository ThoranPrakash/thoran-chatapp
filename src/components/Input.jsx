import React, { useContext, useState } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { AiOutlinePaperClip } from 'react-icons/ai'
import { IoMdMic, IoMdSend } from 'react-icons/io'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { v4 as uuid } from 'uuid'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'


const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  const handleKeydown = (e) => {
    e.code === "Enter" && handleSend();
  }

  const handleSend = async () => {
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        (error) => {
          // setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: formatAMPM(new Date()),
                image: downloadURL
              }),
            });
          });
        }
      );
    } else {
      setText("");
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: formatAMPM(new Date()),
        }),
      })
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        status: 'read',
        senderId: currentUser.uid,
      },
      [data.chatId + ".date"]: formatAMPM(new Date()),
    });
    
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        status: 'unread',
        senderId: data.user.uid,
      },
      [data.chatId + ".date"]: formatAMPM(new Date()),
    });

    setImage(null);
  }
  return (
    <div className="input">
      <div className="emoji"><BsEmojiSmile /></div>
      <label htmlFor="attach"><AiOutlinePaperClip /></label>
      <input type="file" id="attach" className="attach" style={{ display: "none" }} onChange={(e) => { setImage(e.target.files[0]) }} />
      <input type="text" placeholder="Type a message" onKeyDown={handleKeydown} onChange={(e) => setText(e.target.value)} value={text} />
      <div><IoMdSend onClick={handleSend} /></div>
      <div><IoMdMic /></div>
    </div>
  )
}

export default Input

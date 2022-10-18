import React, { useContext, useEffect, useState } from 'react'
import { BiCheckDouble } from 'react-icons/bi'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [lastMessage, setLastMessage] = useState('');
  const [status, setStatus] = useState('');


  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  function handleSelect(u, lastMessage, status) {
    dispatch({ type: "CHANGE_USER", payload: u })
    setLastMessage(lastMessage);
    setStatus(status);
  }
  useEffect(()=>{
    // console.log("uid changed from undefined to a value : "+ JSON.stringify(data));
      updateStatus(data);
  },[data])

  const updateStatus = async (data) => {
      // console.log(currentUser.uid + '+' + userData.user.uid);
      // console.log(data.chatId, currentUser.uid, data.user.uid)
      if(data.chatId !== "null" && status === 'unread'){
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text: lastMessage,
            status: 'read',
          }
        });
      }
  }
  return (
    <>
      {Object.entries(chats)?.sort((a, b) => (b[1].date ? b[1].date.substr(3, 2) : b[1].date) - (a[1].date ? a[1].date.substr(3, 2) : a[1].date)).map((chat) => (
        <div className="userChats" key={chat[0]} onClick={() => { handleSelect(chat[1].userInfo, chat[1].lastMessage?.text, chat[1].lastMessage?.status) }}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span className="userName">{chat[1].userInfo.displayName}</span>
            <p className="userMessage" style={{ color: (chat[1].lastMessage?.status === 'unread') && 'black' }}> <BiCheckDouble />{chat[1].lastMessage?.text}</p>
          </div>
          <p className="time">{chat[1].date?.toString()}</p>
        </div>
      ))}
    </>
  )
}

export default Chats

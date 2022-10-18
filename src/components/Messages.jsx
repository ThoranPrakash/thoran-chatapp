import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Message from '../components/Message'
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const Messages = () => { 
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  // const messageRef = useRef(null);
  // useEffect(() => {
  //   if (messageRef.current) {
  //     messageRef.current.scrollIntoView(
  //       {
  //         behavior: 'smooth',
  //         block: 'end',
  //         inline: 'nearest'
  //       })
  //   }
  // })
  useEffect(()=>{
    const unsub = onSnapshot(doc(db,"chats",data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages)
    })

    return ()=>{
      unsub();
    }
  },[data.chatId])
  // useEffect(() => {
    
  //   const getChats = () => {
  //     const unsub = onSnapshot(doc(db, "userChats", data.chatId), (doc) => {
  //       setChats(doc.data());
  //     });
  //     return () => {
  //       unsub();
  //     };
  //   };
  //   currentUser.uid && getChats();
  // },[data.chatId]);
  return (
    <div className="messages">
      {
        messages.map((m)=>{
          return <Message message={m} key={m.id}/>
        })
      }
    </div>
  )
}

export default Messages

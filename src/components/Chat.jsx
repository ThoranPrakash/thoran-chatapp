import React, { useContext } from 'react'
import dp from '../Images/thoran.jpg'
import add from '../Images/add.png';
import cam from '../Images/cam.png';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="userChats">
          <img src={data.user?.photoURL} alt="" />
          <div className="userChatInfo">
            <span className="userName">{data.user?.displayName}</span>
            <p className="userMessage">{data.chatId === "null" ? 'Select a user to chat' : 'Last seen just now'}</p>
          </div>
          <img src={add} alt="" />
          <img src={cam} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat

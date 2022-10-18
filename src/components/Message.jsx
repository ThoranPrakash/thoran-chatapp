import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { BiCheckDouble } from 'react-icons/bi';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {
  const {currentUser} = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  let date = formatAMPM(new Date());
  console.log(currentUser);
  
  return (
    <div className={`message ${message.senderId === currentUser.uid && `owner`}`}>
      <div className="messageContent">
          <p>{message.text}</p><span>{(date.substring(4,2) - message.date.substring(4,2)) === 0 ? 'just now' : message.date}</span>{message.senderId === currentUser.uid && <BiCheckDouble viewBox='0 -3 24 24'/>}
      </div>
    </div>
  )
}

export default Message

import React, { useState, useContext } from 'react'
import { BsSearch } from 'react-icons/bs'
import { FaTimes } from 'react-icons/fa'
import { collection, query, where, getDoc, setDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import loader from '../Images/loading.gif'
import { AuthContext } from '../context/AuthContext'

const Search = () => {
  const [cancelButton, setCancelButton] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext)
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
  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        setErr(true);
        setSpinner(false);
      }
      querySnapshot.forEach((doc) => {
        setErr(false);
        setSpinner(false);
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  }
  const handleKeydown = (e) => {
    e.code === "Enter" && handleSearch();
  }
  const handleChange = (e) => {
    setSpinner(true);
    setCancelButton(true);
    setUser(null);
    setErr(false);
    setUserName(e.target.value)
  }
  const clearText = () => {
    setUserName("");
    setSpinner(false);
    setCancelButton(false);
    setUser(null);
    setErr(false);
  }
  const handleSelect = async () => {
    const combinedId = currentUser.uid > user.uid 
    ? currentUser.uid + user.uid 
    : user.uid + currentUser.uid;
    try{
      const res = await getDoc(doc(db, "chats", combinedId));
      if(!res.exists()){
        
        await setDoc(doc(db, "chats", combinedId),{messages:[]});
        
        await updateDoc(doc(db, "userChats", currentUser.uid),{
          [combinedId+".userInfo"]:{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+".date"]: formatAMPM(new Date())
        })
        await updateDoc(doc(db, "userChats", user.uid),{
          [combinedId+".userInfo"]:{
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId+".date"]: formatAMPM(new Date())
        })
      }
    }catch(e){

    }
    setUser(null);
    setUserName("");
  }

  return (
    <div className="chatResult">
      <div className="search">
        <div className="searchForm">
          <span className="searchIcon"><BsSearch /></span>
          <input type="text" placeholder="Search or start a new chat" value={userName} onKeyDown={handleKeydown} onChange={(e) => handleChange(e)} />
          {cancelButton && <span className="cancleIcon" onClick={clearText}><FaTimes /></span>}
        </div>
      </div>
      {err && <div className="error">No chats found</div>}
      {spinner && <div className="loader">
        <img src={loader} alt="" />
      </div>}
      {user && <div className="userChats" onClick={handleSelect}>
        <h4 className="chatHeading">Chat Results</h4>
        <div>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span className="userName">{user.displayName}</span>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Search

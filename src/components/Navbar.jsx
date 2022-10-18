import React,{useContext} from 'react'
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import { signOut } from "firebase/auth"
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext'
import noUser from '../Images/noUser.jpeg'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <>
      <div className="navbar">
        <img src={currentUser.photoURL ? currentUser.photoURL : noUser} alt="" />
        <div className="user">
          <span className="icons"><BsFillChatLeftTextFill /></span>
          <span className="icons"><BsThreeDotsVertical /></span>
          <span className="icons" onClick={()=>signOut(auth)}><FiLogOut /></span>
        </div>
      </div>
    </>
  )
}
export default Navbar

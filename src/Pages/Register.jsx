import React, { useState } from 'react';
import img from '../Images/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db} from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, userName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            await updateProfile(res.user, {
              displayName: userName,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: userName,
              email,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/")
          });
        }
      );
    } catch (err) {
      setErr(true);
    }
  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <form onSubmit={handleSubmit}>
          <span className="logo">Thor Chat</span>
          <span className="title">Register</span>
          <input type="text" placeholder="Display Name" name="displayName" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <label htmlFor="avatar">
            <img src={img} alt="select an avatar" /><span>Select an avatar</span>
          </label>
          <input style={{ display: 'none' }} type="file" placeholder="Profile Pic" id="avatar" />
          <button className="registerButton">Sign Up</button>
          {err && <span>Something went wrong..!</span>}
        </form>
        <p>You do have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  )
}

export default Register

import React, {useState} from 'react';
import { auth} from "../firebase";
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/')
    } catch (err) {
      setErr(true);
    }
  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
          <form onSubmit={handleSubmit}>
          <span className="logo">Thor Chat</span>
          <span className="title">Login</span>
              <input type="email" placeholder="Email"/>
              <input type="password" placeholder="Password"/>
              <button className="loginButton">Login</button>
          </form>
          {err && <span>Something went wrong..!</span>}
          <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login

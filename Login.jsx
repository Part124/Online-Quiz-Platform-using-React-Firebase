import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔹 LOGIN OR AUTO-SIGNUP LOGIC
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Try to login first
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate("/dashboard");

    } catch (error) {
      // If user does not exist → create account automatically
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert("New account created & logged in");
          navigate("/dashboard");
        } catch (signupError) {
          alert(signupError.message);
        }
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "350px",
          padding: "30px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Login / Signup
        </button>

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          New users are automatically registered
        </p>
      </form>
    </div>
  );
};

export default Login;

import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";

function Login({ onAuthSuccess, switchToRegister }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function login() {
    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const data = await response.json();
    setMessage(data.message || "Login complete");

    if (response.ok) {
      localStorage.setItem("mybazaar_user", JSON.stringify(data.user));
      localStorage.setItem("mybazaar_token", data.token);
      if (onAuthSuccess) onAuthSuccess(data.user);
    }
  }

  return (
    <Box sx={{ width: 420, mx: "auto", mt: 4, p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Welcome back</Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <TextField fullWidth label="Email" name="email" value={user.email} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Password" type="password" name="password" value={user.password} onChange={handleChange} sx={{ mb: 2 }} />
      <Button variant="contained" fullWidth onClick={login}>Login</Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        New here? <Button onClick={switchToRegister}>Register</Button>
      </Typography>
    </Box>
  );
}

export default Login;

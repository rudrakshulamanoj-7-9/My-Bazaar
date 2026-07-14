import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";

function Register({ onRegisterSuccess, switchToLogin }) {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function register() {
    const response = await fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const data = await response.json();
    setMessage(data.message || "Registration complete");

    if (response.ok) {
      setUser({ name: "", email: "", password: "" });
      if (onRegisterSuccess) onRegisterSuccess(data.user || null);
    }
  }

  return (
    <Box sx={{ width: 420, mx: "auto", mt: 4, p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Create your account</Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <TextField fullWidth label="Name" name="name" value={user.name} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Email" name="email" value={user.email} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Password" type="password" name="password" value={user.password} onChange={handleChange} sx={{ mb: 2 }} />
      <Button variant="contained" fullWidth onClick={register}>Register</Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Button onClick={switchToLogin}>Login</Button>
      </Typography>
    </Box>
  );
}

export default Register;

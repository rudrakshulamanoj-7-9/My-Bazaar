import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import Register from "./Register";
import Login from "./Login";
import Product from "./Product";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("mybazaar_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView("marketplace");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("mybazaar_user");
    localStorage.removeItem("mybazaar_token");
    setUser(null);
    setView("login");
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>My Bazaar</Typography>
          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>Hello, {user.name}</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => setView("login")}>Login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {!user && view === "register" && (
          <Register onRegisterSuccess={() => setView("login")} switchToLogin={() => setView("login")} />
        )}

        {!user && view === "login" && (
          <Login onAuthSuccess={(data) => { setUser(data); setView("marketplace"); }} switchToRegister={() => setView("register")} />
        )}

        {user && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>You are signed in and can buy or sell items.</Typography>
            <Product user={user} />
          </Box>
        )}
      </Container>
    </div>
  );
}

export default App;
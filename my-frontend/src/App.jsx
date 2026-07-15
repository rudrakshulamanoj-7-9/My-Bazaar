import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, Stack } from "@mui/material";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import BuyProductsPage from "./BuyProductsPage";
import SellProductsPage from "./SellProductsPage";

function ChoiceScreen() {
  return (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>What do you want to do?</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>Choose one option below to continue.</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button fullWidth variant="contained" size="large" component={Link} to="/buy">
            Buy a product
          </Button>
          <Button fullWidth variant="outlined" size="large" component={Link} to="/sell">
            Sell a product
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

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
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/buy">Buy</Button>
              <Button color="inherit" component={Link} to="/sell">Sell</Button>
              <Typography sx={{ mx: 2 }}>Hello, {user.name}</Typography>
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
          <Routes>
            <Route path="/" element={<ChoiceScreen />} />
            <Route path="/buy" element={<BuyProductsPage />} />
            <Route path="/sell" element={<SellProductsPage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Container>
    </div>
  );
}

export default App;
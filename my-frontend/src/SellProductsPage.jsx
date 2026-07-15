import { useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SellProductsPage({ user }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [listing, setListing] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    reason: "",
    type: "sell"
  });

  function handleChange(e) {
    setListing({ ...listing, [e.target.name]: e.target.value });
  }

  async function addProduct() {
    if (!user) {
      setMessage("Please log in before creating a listing.");
      return;
    }

    const response = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("mybazaar_token")}`
      },
      body: JSON.stringify({
        ...listing,
        description: listing.reason || listing.description,
        type: "sell"
      })
    });

    const data = await response.json();

    if (response.ok) {
      setListing({ name: "", description: "", price: "", image: "", reason: "", type: "sell" });
      setMessage("Product uploaded successfully. It is now visible in Buy Products.");
      setDialogOpen(true);
    } else {
      setMessage(data.error || data.message || "Unable to upload product.");
    }
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Sell Used Products</Typography>
      </Box>

      {message && <Alert severity="info" sx={{ mb: 3 }}>{message}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Post a used product for sale</Typography>
        <TextField fullWidth label="Product Name" name="name" value={listing.name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Reason for Selling" name="reason" value={listing.reason} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Price" name="price" value={listing.price} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Photo URL" name="image" value={listing.image} onChange={handleChange} sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth onClick={addProduct}>
          Publish Product
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          After you publish, the item will appear on the Buy Products page.
        </Typography>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Product uploaded</DialogTitle>
        <DialogContent>
          <Typography>Your product was uploaded successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SellProductsPage;

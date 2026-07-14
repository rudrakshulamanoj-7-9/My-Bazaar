import { Button, TextField, Typography, Box, Paper, Chip, Stack, Alert } from "@mui/material";
import { useEffect, useState } from "react";

function Product({ user }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [listing, setListing] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "sell"
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch("http://localhost:5000/products");
    const data = await response.json();
    setProducts(data.products || []);
  }

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
      body: JSON.stringify(listing)
    });

    const data = await response.json();
    setMessage(data.message || "Listing created");

    if (response.ok) {
      setListing({ name: "", description: "", price: "", category: "", type: "sell" });
      fetchProducts();
    }
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Marketplace</Typography>
      {message && <Alert severity="info" sx={{ mb: 3 }}>{message}</Alert>}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Paper sx={{ flex: 1, minWidth: 320, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Post a listing</Typography>
          <TextField fullWidth label="Title" name="name" value={listing.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" name="description" value={listing.description} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Price" name="price" value={listing.price} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Category" name="category" value={listing.category} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Type" name="type" value={listing.type} onChange={handleChange} sx={{ mb: 2 }} placeholder="sell or buy" />
          <Button variant="contained" fullWidth onClick={addProduct}>Publish Listing</Button>
        </Paper>

        <Paper sx={{ flex: 2, minWidth: 320, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Available listings</Typography>
          <Stack spacing={2}>
            {products.map((p) => (
              <Box key={p._id} sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6">{p.name}</Typography>
                  <Chip label={p.type || "sell"} color={p.type === "buy" ? "secondary" : "primary"} />
                </Box>
                <Typography variant="body2" sx={{ my: 1 }}>{p.description}</Typography>
                <Typography variant="body1" fontWeight="bold">?{p.price}</Typography>
                <Typography variant="body2" color="text.secondary">Category: {p.category}</Typography>
                <Typography variant="body2" color="text.secondary">Seller: {p.sellerName || "Unknown"}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default Product;

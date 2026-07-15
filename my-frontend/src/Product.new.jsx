import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useEffect, useState } from "react";

function Product({ user }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("choose");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [listing, setListing] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
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
      setListing({ name: "", description: "", price: "", category: "", image: "", type: "sell" });
      fetchProducts();
      setMode("buy");
    }
  }

  function handleOrder(product) {
    setDialogMessage(`Your order for ${product.name} was placed successfully.`);
    setDialogOpen(true);
  }

  const filteredProducts = products.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    );
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>My Bazaar</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Choose what you want to do after login.</Typography>
      {message && <Alert severity="info" sx={{ mb: 3 }}>{message}</Alert>}

      {mode === "choose" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>What do you want to do?</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" fullWidth onClick={() => setMode("buy")}>I want to buy</Button>
            <Button variant="outlined" fullWidth onClick={() => setMode("sell")}>I want to sell</Button>
          </Stack>
        </Paper>
      )}

      {mode === "buy" && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Buy Products</Typography>
            <Button variant="outlined" onClick={() => setMode("choose")}>Back</Button>
          </Box>

          <TextField fullWidth label="Search products" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }} />

          <Stack spacing={2}>
            {filteredProducts.map((p) => (
              <Paper key={p._id} sx={{ p: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {p.image && <Box component="img" src={p.image} alt={p.name} sx={{ width: 140, height: 110, objectFit: "cover", borderRadius: 2 }} />}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6">{p.name}</Typography>
                      <Chip label={p.type || "sell"} color={p.type === "buy" ? "secondary" : "primary"} />
                    </Box>
                    <Typography variant="body2" sx={{ my: 1 }}>{p.description}</Typography>
                    <Typography variant="body1" fontWeight="bold">₹{p.price}</Typography>
                    <Typography variant="body2" color="text.secondary">Category: {p.category}</Typography>
                    <Typography variant="body2" color="text.secondary">Seller: {p.sellerName || "Unknown"}</Typography>
                    <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleOrder(p)}>Order Now</Button>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {mode === "sell" && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Sell a Product</Typography>
            <Button variant="outlined" onClick={() => setMode("choose")}>Back</Button>
          </Box>

          <Paper sx={{ p: 3 }}>
            <TextField fullWidth label="Product Name" name="name" value={listing.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Description" name="description" value={listing.description} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Price" name="price" value={listing.price} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Category" name="category" value={listing.category} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Photo URL" name="image" value={listing.image} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Type" name="type" value={listing.type} onChange={handleChange} sx={{ mb: 2 }} placeholder="sell or buy" />
            <Button variant="contained" fullWidth onClick={addProduct}>Publish Product</Button>
          </Paper>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Order placed</DialogTitle>
        <DialogContent>{dialogMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Product;

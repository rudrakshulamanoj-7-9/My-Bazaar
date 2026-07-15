import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
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
  const [page, setPage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState({ phone: "", address: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [listing, setListing] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    reason: "",
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
      body: JSON.stringify({
        ...listing,
        description: listing.reason || listing.description,
        type: "sell"
      })
    });

    const data = await response.json();
    setMessage(data.message || "Listing created");

    if (response.ok) {
      setListing({ name: "", description: "", price: "", image: "", reason: "", type: "sell" });
      await fetchProducts();
      setPage("buy");
    }
  }

  function handleOrder(product) {
    setSelectedProduct(product);
    setOrderInfo({ phone: "", address: "" });
    setDialogMessage("");
    setDialogOpen(true);
  }

  function handleOrderSubmit() {
    if (!orderInfo.phone || !orderInfo.address) {
      setDialogMessage("Please enter your phone number and address.");
      return;
    }

    setDialogMessage(`Your order for ${selectedProduct?.name || "this item"} was placed successfully.\nPhone: ${orderInfo.phone}\nAddress: ${orderInfo.address}`);
    setDialogOpen(true);
  }

  function handleOrderInfoChange(e) {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value });
  }

  const sellListings = products.filter((p) => (p.type || "sell").toLowerCase() === "sell");

  const filteredSellListings = sellListings.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.reason?.toLowerCase().includes(search)
    );
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>My Bazaar</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>Browse products to buy or post your own used items for sale.</Typography>
      {message && <Alert severity="info" sx={{ mb: 3 }}>{message}</Alert>}

      {page === "home" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Choose a page</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" fullWidth onClick={() => setPage("buy")}>Buy products</Button>
            <Button variant="outlined" fullWidth onClick={() => setPage("sell")}>Sell / used products</Button>
          </Stack>
        </Paper>
      )}

      {page === "buy" && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Buy Products</Typography>
            <Button variant="outlined" onClick={() => setPage("home")}>Back</Button>
          </Box>

          <TextField fullWidth label="Search products" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }} />

          <Stack spacing={2}>
            {filteredSellListings.length === 0 ? (
              <Alert severity="info">No products are available right now. Please check back soon.</Alert>
            ) : (
              filteredSellListings.map((p) => (
                <Paper key={p._id} sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {p.image && <Box component="img" src={p.image} alt={p.name} sx={{ width: 140, height: 110, objectFit: "cover", borderRadius: 2 }} />}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{p.name}</Typography>
                      <Typography variant="body2" sx={{ my: 1 }}>{p.reason || p.description}</Typography>
                      <Typography variant="body1" fontWeight="bold">₹{p.price}</Typography>
                      <Typography variant="body2" color="text.secondary">Seller: {p.sellerName || "Unknown"}</Typography>
                      <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleOrder(p)}>Order Now</Button>
                    </Box>
                  </Box>
                </Paper>
              ))
            )}
          </Stack>
        </Box>
      )}

      {page === "sell" && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h5">Sell / Used Products</Typography>
            <Button variant="outlined" onClick={() => setPage("home")}>Back</Button>
          </Box>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Post a used product for sale</Typography>
            <TextField fullWidth label="Product Name" name="name" value={listing.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Reason for Selling" name="reason" value={listing.reason} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Price" name="price" value={listing.price} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Photo URL" name="image" value={listing.image} onChange={handleChange} sx={{ mb: 2 }} />
            <Button variant="contained" fullWidth onClick={addProduct}>Publish Product</Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recently listed items</Typography>
            <Stack spacing={2}>
              {filteredSellListings.length === 0 ? (
                <Alert severity="info">No listings yet. Your first upload will appear here.</Alert>
              ) : (
                filteredSellListings.map((p) => (
                  <Box key={p._id} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle1">{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{p.reason || p.description}</Typography>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogMessage ? "Order placed" : "Place your order"}</DialogTitle>
        <DialogContent>
          {dialogMessage ? (
            <Typography sx={{ whiteSpace: "pre-line" }}>{dialogMessage}</Typography>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={orderInfo.phone}
                onChange={handleOrderInfoChange}
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={orderInfo.address}
                onChange={handleOrderInfoChange}
                multiline
                rows={3}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {dialogMessage ? (
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          ) : (
            <>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleOrderSubmit}>Confirm Order</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Product;

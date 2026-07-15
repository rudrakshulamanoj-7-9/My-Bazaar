import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

function BuyProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState({ phone: "", address: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch("http://localhost:5000/products");
    const data = await response.json();
    setProducts(data.products || []);
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

  const filteredProducts = sellListings.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.reason?.toLowerCase().includes(search)
    );
  });

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Buy Products</Typography>
      </Box>

      <TextField fullWidth label="Search products" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }} />

      <Stack spacing={2}>
        {filteredProducts.length === 0 ? (
          <Alert severity="info">No products are available right now.</Alert>
        ) : (
          filteredProducts.map((p) => (
            <Paper key={p._id} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {p.image && <Box component="img" src={p.image} alt={p.name} sx={{ width: 140, height: 110, objectFit: "cover", borderRadius: 2 }} />}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>{p.reason || p.description}</Typography>
                  <Typography variant="body1" fontWeight="bold">₹{p.price}</Typography>
                  <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleOrder(p)}>
                    Order Now
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogMessage ? "Order placed" : "Place your order"}</DialogTitle>
        <DialogContent>
          {dialogMessage ? (
            <Typography sx={{ whiteSpace: "pre-line" }}>{dialogMessage}</Typography>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField fullWidth label="Phone Number" name="phone" value={orderInfo.phone} onChange={handleOrderInfoChange} />
              <TextField fullWidth label="Address" name="address" value={orderInfo.address} onChange={handleOrderInfoChange} multiline rows={3} />
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

export default BuyProductsPage;

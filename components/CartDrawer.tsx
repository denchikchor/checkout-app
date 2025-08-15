"use client";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "@/cart/CartContext";

import PromoForm from "./PromoForm";
import OrderSummary from "./OrderSummary";

export default function CartDrawer() {
  const { items, removeItem, updateQty, open, setOpen, money } = useCart();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ sx: { width: { xs: "100%", sm: 420 } } }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Your Cart
        </Typography>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexGrow: 1,
        }}
      >
        {items.length === 0 ? (
          <Typography variant="body2">Cart is empty</Typography>
        ) : (
          items.map((i) => (
            <Stack key={i.id} direction="row" spacing={1} alignItems="center">
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={i.thumbnail}
                alt={i.title}
                width={56}
                height={56}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography noWrap>{i.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {money(i.price)}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: 0.5 }}
                >
                  <IconButton
                    size="small"
                    onClick={() => updateQty(i.id, i.qty - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    size="small"
                    value={i.qty}
                    inputProps={{ style: { width: 32, textAlign: "center" } }}
                    onChange={(e) =>
                      updateQty(i.id, Number(e.target.value) || 1)
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => updateQty(i.id, i.qty + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <IconButton color="error" onClick={() => removeItem(i.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))
        )}

        <PromoForm />
        <OrderSummary />
        <Button
          variant="contained"
          size="large"
          disabled={items.length === 0}
          onClick={() => alert("Checkout complete!")}
        >
          Checkout
        </Button>
      </Box>
    </Drawer>
  );
}

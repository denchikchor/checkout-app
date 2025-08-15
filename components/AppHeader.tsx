"use client";
import { AppBar, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import { useCart } from "@/cart/CartContext";

export default function AppHeader() {
  const { items, hydrated, setOpen } = useCart();
  const count = hydrated ? items.reduce((s, i) => s + i.qty, 0) : 0;

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #eee" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Checkout Demo
          </Link>
        </Typography>
        <IconButton onClick={() => setOpen(true)} aria-label="cart">
          <Badge badgeContent={count} color="primary" showZero>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

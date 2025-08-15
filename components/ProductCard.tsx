"use client";
import { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Skeleton,
  Box,
} from "@mui/material";
import Link from "next/link";

import { useCart } from "@/cart/CartContext";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export default function ProductCard({ p }: { p: Product }) {
  const { addItem, money } = useCart();
  const [snackOpen, setSnackOpen] = useState(false);

  // Image loading state
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem({
      id: p.id,
      title: p.title,
      price: p.price,
      thumbnail: p.thumbnail,
      qty: 1,
    });
    setSnackOpen(true);
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Image with overlay skeleton */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 180,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={p.thumbnail}
            alt={p.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: imgLoaded && !imgError ? 1 : 0,
              transition: "opacity .2s ease",
            }}
          />

          {!imgLoaded && !imgError && (
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}

          {imgError && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                bgcolor: "background.default",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Image failed to load
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" gutterBottom noWrap>
            {p.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {p.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {money(p.price)}
          </Typography>
        </CardContent>

        <CardActions>
          <Stack direction="row" spacing={1} sx={{ px: 1, pb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              component={Link}
              href={`/product?product_id=${p.id}`}
            >
              Details
            </Button>
            <Button size="small" variant="contained" onClick={handleAdd}>
              Add to Cart
            </Button>
          </Stack>
        </CardActions>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={1000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Added “{p.title}” to cart
        </Alert>
      </Snackbar>
    </>
  );
}

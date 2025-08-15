"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Grid,
  Skeleton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { useCart } from "@/cart/CartContext";

type ProductDetail = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images?: string[];
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
  discountPercentage?: number;
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  tags?: string[];
};

export default function ProductDetailsClient() {
  const sp = useSearchParams();
  const id = sp.get("product_id");

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { addItem, setOpen, money } = useCart();

  useEffect(() => {
    let ignore = false;
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as ProductDetail;
        if (!ignore) setProduct(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (!id) {
    return <Typography>Missing product_id in URL</Typography>;
  }

  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={560} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={660} />
        </Grid>
      </Grid>
    );
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ overflow: "hidden", borderRadius: 1 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 320, md: 560 },
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={product.thumbnail}
              alt={product.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: imgLoaded && !imgError ? 1 : 0,
                transition: "opacity .2s ease",
                display: "block",
              }}
            />
            {!imgLoaded && !imgError && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ position: "absolute", inset: 0 }}
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
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Image failed to load
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {product.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
              {product.category && (
                <Typography variant="caption">{product.category}</Typography>
              )}
              {product.brand && (
                <Typography variant="caption" color="text.secondary">
                  • {product.brand}
                </Typography>
              )}
            </Stack>

            <Typography variant="h6" sx={{ mb: 2 }}>
              {money(product.price)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={() => {
                  addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    qty: 1,
                  });
                  setOpen(true);
                }}
              >
                Add to Cart
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Skeleton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useCart } from "@/cart/CartContext";
import CartDrawer from "@/components/CartDrawer";

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

export default function ProductDetailsPage() {
  const sp = useSearchParams();
  const id = sp.get("product_id");
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const { addItem, setOpen, money } = useCart();

  useEffect(() => {
    let ignore = false;
    if (!id) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        if (!ignore) setProduct(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <Container sx={{ py: 3 }}>
      {!id ? (
        <Typography>Missing product_id in URL</Typography>
      ) : loading ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={560} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={660} />
          </Grid>
        </Grid>
      ) : product ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardMedia
                component="img"
                image={product.thumbnail}
                alt={product.title}
              />
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                {/* Title */}
                <Typography variant="h5" gutterBottom>
                  {product.title}
                </Typography>

                {/* Category / Brand */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1, flexWrap: "wrap" }}
                >
                  {product.category && (
                    <Chip label={product.category} size="small" />
                  )}
                  {product.brand && (
                    <Chip
                      label={product.brand}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>

                {/* Rating + Stock */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Rating
                    name="product-rating"
                    value={
                      typeof product.rating === "number" ? product.rating : 0
                    }
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {typeof product.rating === "number"
                      ? product.rating.toFixed(1)
                      : "—"}
                  </Typography>
                  {typeof product.stock === "number" && (
                    <Chip
                      label={`Stock: ${product.stock}`}
                      size="small"
                      sx={{ ml: "auto" }}
                    />
                  )}
                </Stack>

                {/* Price */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">{money(product.price)}</Typography>
                </Stack>

                {/* Description */}
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Key details */}
                <List dense sx={{ py: 0 }}>
                  {product.sku && (
                    <ListItem disableGutters>
                      <ListItemText primary="SKU" secondary={product.sku} />
                    </ListItem>
                  )}
                  {typeof product.weight === "number" && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Weight"
                        secondary={`${product.weight}`}
                      />
                    </ListItem>
                  )}
                  {product.dimensions && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Dimensions"
                        secondary={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth}`}
                      />
                    </ListItem>
                  )}
                  {product.warrantyInformation && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Warranty"
                        secondary={product.warrantyInformation}
                      />
                    </ListItem>
                  )}
                  {product.shippingInformation && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Shipping"
                        secondary={product.shippingInformation}
                      />
                    </ListItem>
                  )}
                  {product.availabilityStatus && (
                    <ListItem disableGutters>
                      <ListItemText
                        primary="Availability"
                        secondary={product.availabilityStatus}
                      />
                    </ListItem>
                  )}
                </List>

                {/* CTA */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
      ) : (
        <Typography>Product not found</Typography>
      )}
      <CartDrawer />
    </Container>
  );
}

"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Container, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ProductCard, { Product } from "./ProductCard";

export default function ProductsGrid() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=12");
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        if (!ignore) setProducts(data.products);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={2}>
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, md: 3 }}>
              <Skeleton variant="rectangular" height={380} />
            </Grid>
          ))
        ) : products.length ? (
          products.map((p) => (
            <Grid key={p.id} size={{ xs: 12, md: 3 }}>
              <ProductCard p={p} />
            </Grid>
          ))
        ) : (
          <Typography>Nothing found</Typography>
        )}
      </Grid>
    </Container>
  );
}

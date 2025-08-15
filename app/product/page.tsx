import { Suspense } from "react";
import { Container, Grid, Skeleton } from "@mui/material";
import CartDrawer from "@/components/CartDrawer";
import ProductDetailsClient from "./ProductDetailsClient";

export default function ProductPage() {
  return (
    <Container sx={{ py: 3 }}>
      <Suspense
        fallback={
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={560} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={660} />
            </Grid>
          </Grid>
        }
      >
        <ProductDetailsClient />
      </Suspense>

      <CartDrawer />
    </Container>
  );
}

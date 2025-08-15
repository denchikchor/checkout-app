'use client';
import { Grid, Skeleton } from '@mui/material';
export default function ProductSkeleton() {
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
import { Suspense } from 'react';
import { Container} from '@mui/material';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailsClient from './ProductDetailsClient';
import ProductSkeleton from '@/components/ProductSkeleton';

export default function ProductPage() {
  return (
    <Container sx={{ py: 3 }}>
      <Suspense
        fallback={<ProductSkeleton />}
      >
        <ProductDetailsClient />
      </Suspense>

      <CartDrawer />
    </Container>
  );
}

"use client";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useCart } from "@/cart/CartContext";

export default function OrderSummary() {
  const { subtotal, discount, total, money, promo } = useCart();
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={0.5}>
          <Row label="Subtotal" value={money(subtotal)} />
          <Row
            label={`Discount${promo ? ` (${promo.code})` : ""}`}
            value={`- ${money(discount)}`}
          />
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
            Total: {money(total)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

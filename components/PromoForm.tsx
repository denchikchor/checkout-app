"use client";
import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useCart } from "@/cart/CartContext";

export default function PromoForm() {
  const { promo, applyPromoCode, clearPromo } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();

  function onApply() {
    const { ok, message } = applyPromoCode(code);
    if (ok) setCode("");
    if (!ok) setError(message);
    else setError(undefined);
  }

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        label="Promo code"
        size="small"
        fullWidth
        value={promo?.code ?? code}
        disabled={!!promo}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onApply();
        }}
        error={!!error}
        helperText={error}
      />
      {promo ? (
        <Button variant="outlined" onClick={clearPromo}>
          Clear
        </Button>
      ) : (
        <Button variant="contained" onClick={onApply}>
          Apply
        </Button>
      )}
    </Stack>
  );
}

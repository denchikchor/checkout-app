cat > README-quick.md << 'EOF'

# Checkout Demo (Next.js + TypeScript + MUI)

**Live demo:** https://checkout-app-eight.vercel.app/

## Promo codes

- `SAVE10` — 10% off  
- `SAVE20` — 20% off
---
Simple checkout demo using Next.js (App Router), TypeScript, and MUI v7. Products come from DummyJSON.

## Stack

- Next.js + TypeScript
- MUI v7 (+ SSR integration)
- React Context + useReducer
- DummyJSON Products API

## Features

- Product grid with image skeletons & infinite scroll
- Slide-in Cart (Drawer): add/remove/update, promo **SAVE10/SAVE20**, summary (subtotal/discount/total), snackbars
- Product page `/product?product_id=ID` (loads details by search param)
- Cart & promo persisted in `localStorage` (hydration-safe)

## Quick start

```bash
pnpm install
pnpm dev
# build: pnpm build && pnpm start
```

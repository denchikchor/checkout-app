import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import ThemeRegistry from "./ThemeRegistry";
import { CartProvider } from "@/cart/CartContext";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Checkout Demo",
  description: "Next.js + TS + MUI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <CartProvider>
              <AppHeader />
              {children}
            </CartProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

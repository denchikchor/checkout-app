"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

/** ===== Types ===== */
export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  qty: number;
};

export type Promo =
  | { code: "SAVE10"; type: "percent"; value: 10 }
  | { code: "SAVE20"; type: "percent"; value: 20 }
  | null;

export type CartState = {
  items: CartItem[];
  promo: Promo;
};

type Persisted = Pick<CartState, "items" | "promo">;

const STORAGE_KEY = "checkout_cart_v1";

/** ===== Reducer ===== */
type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QTY"; payload: { id: number; qty: number } }
  | { type: "APPLY_PROMO"; payload: Promo }
  | { type: "CLEAR_PROMO" }
  | { type: "HYDRATE"; payload: Persisted };

const initial: CartState = { items: [], promo: null };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === exists.id ? { ...i, qty: i.qty + action.payload.qty } : i,
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, qty: Math.max(1, Math.floor(action.payload.qty) || 1) }
            : i,
        ),
      };
    case "APPLY_PROMO":
      return { ...state, promo: action.payload };
    case "CLEAR_PROMO":
      return { ...state, promo: null };
    case "HYDRATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

/** ===== Helpers ===== */
function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
function calcDiscount(subtotal: number, promo: Promo) {
  if (!promo) return 0;
  return (subtotal * promo.value) / 100;
}
/** Fix locale to avoid SSR/CSR formatting mismatch */
function toMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

/** ===== Context shape (public API) ===== */
type Ctx = CartState & {
  addItem: (i: CartItem) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  applyPromoCode: (code: string) => { ok: boolean; message?: string };
  clearPromo: () => void;

  subtotal: number;
  discount: number;
  total: number;

  open: boolean;
  setOpen: (v: boolean) => void;

  money: typeof toMoney;
  hydrated: boolean; // true after localStorage has been applied on the client
};

const CartCtx = createContext<Ctx | null>(null);

/** ===== Provider ===== */
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Do not read localStorage during initial render (SSR-safe)
  const [state, dispatch] = useReducer(reducer, initial);

  // Drawer open state (session-only)
  const [open, setOpen] = useState(false);

  // Set to true after client-side hydration from localStorage
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const persisted = JSON.parse(raw) as Persisted;
        dispatch({ type: "HYDRATE", payload: persisted });
      }
      const cartOpen = sessionStorage.getItem("cart_open") === "1";
      setOpen(cartOpen);
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist changes after hydration (avoid overwriting with empty state)
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: Persisted = { items: state.items, promo: state.promo };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [state.items, state.promo, hydrated]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;
      try {
        const persisted = JSON.parse(e.newValue) as Persisted;
        dispatch({ type: "HYDRATE", payload: persisted });
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist Drawer open state
  useEffect(() => {
    try {
      sessionStorage.setItem("cart_open", open ? "1" : "0");
    } catch {
      // ignore
    }
  }, [open]);

  // Derived totals
  const subtotal = useMemo(() => calcSubtotal(state.items), [state.items]);
  const discount = useMemo(
    () => calcDiscount(subtotal, state.promo),
    [subtotal, state.promo],
  );
  const total = useMemo(
    () => Math.max(subtotal - discount, 0),
    [subtotal, discount],
  );

  // Promo API
  const applyPromoCode = (code: string) => {
    const map: Record<string, Promo> = {
      SAVE10: { code: "SAVE10", type: "percent", value: 10 },
      SAVE20: { code: "SAVE20", type: "percent", value: 20 },
    };
    const promo = map[code.trim().toUpperCase()] ?? null;
    if (!promo) return { ok: false, message: "Invalid promo code" };
    dispatch({ type: "APPLY_PROMO", payload: promo });
    return { ok: true };
  };

  const value: Ctx = useMemo(
    () => ({
      ...state,
      addItem: (i) => dispatch({ type: "ADD_ITEM", payload: i }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      updateQty: (id, qty) =>
        dispatch({ type: "UPDATE_QTY", payload: { id, qty } }),
      applyPromoCode,
      clearPromo: () => dispatch({ type: "CLEAR_PROMO" }),

      subtotal,
      discount,
      total,

      open,
      setOpen,

      money: toMoney,
      hydrated,
    }),
    [state, subtotal, discount, total, open, hydrated],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

/** ===== Hook ===== */
export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

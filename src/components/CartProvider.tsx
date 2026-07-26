"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  printId: string;
  sizeLabel: string;
  title: string;
  image: string;
  priceCents: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  totalCents: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (printId: string, sizeLabel: string, qty: number) => void;
  remove: (printId: string, sizeLabel: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

const STORAGE_KEY = "sss_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const loaded = useRef(false);

  // survives navigation within the tab, resets when the tab closes
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted storage — start fresh
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode edge cases) — cart still works in memory
    }
  }, [items]);

  const add = (item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.printId === item.printId && i.sizeLabel === item.sizeLabel
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: Math.min(i.qty + 1, 20) } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };

  const setQty = (printId: string, sizeLabel: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.printId === printId && i.sizeLabel === sizeLabel
            ? { ...i, qty: Math.max(0, Math.min(qty, 20)) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const remove = (printId: string, sizeLabel: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.printId === printId && i.sizeLabel === sizeLabel))
    );
  };

  const clear = () => setItems([]);

  const { count, totalCents } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      totalCents: items.reduce((n, i) => n + i.qty * i.priceCents, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, count, totalCents, isOpen, setOpen, add, setQty, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

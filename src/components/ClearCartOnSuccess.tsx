"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Empties the cart once the customer lands on the order-confirmed page. */
export default function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

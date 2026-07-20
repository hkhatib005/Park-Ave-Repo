import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('paj_cart') || '[]'); }
    catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('paj_cart', JSON.stringify(items));
  }, [items]);

  // Server clamps quantity per line item to 20 (see server/routes/checkout.js) — mirror
  // that here so the total shown in the cart always matches what gets charged at checkout.
  const MAX_QTY = 20;

  // A tracked product can never have more of it in the cart than is actually
  // in stock — checkout enforces this atomically as the final authority, but
  // catching it here means a customer never even gets to checkout thinking
  // they're buying 3 of something only 1 exists of.
  const capFor = product => product.stock_qty != null ? Math.min(MAX_QTY, product.stock_qty) : MAX_QTY;

  const addItem = (product, qty = 1) => {
    const cap = capFor(product);
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: Math.min(cap, i.qty + qty) } : i);
      return [...prev, { ...product, qty: Math.min(cap, qty) }];
    });
    setIsOpen(true);
  };

  const removeItem = id => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.min(capFor(i), qty) } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

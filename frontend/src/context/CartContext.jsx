import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'luxora_cart';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i._id === action.item._id);
      if (existing) {
        return { ...state, items: state.items.map(i => i._id === action.item._id ? { ...i, qty: i.qty + (action.qty || 1) } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: action.qty || 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i._id !== action.id) };
    case 'UPDATE_QTY':
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i._id !== action.id) };
      return { ...state, items: state.items.map(i => i._id === action.id ? { ...i, qty: action.qty } : i) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'LOAD':
      return { ...state, items: action.items };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) dispatch({ type: 'LOAD', items: JSON.parse(stored) });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToCart    = (item, qty = 1) => dispatch({ type: 'ADD', item, qty });
  const removeItem   = (id)            => dispatch({ type: 'REMOVE', id });
  const updateQty    = (id, qty)       => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart    = ()              => dispatch({ type: 'CLEAR' });

  const totalItems   = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal     = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax          = subtotal * 0.08;
  const shipping     = subtotal > 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total        = subtotal + tax + shipping;

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeItem, updateQty, clearCart, totalItems, subtotal, tax, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

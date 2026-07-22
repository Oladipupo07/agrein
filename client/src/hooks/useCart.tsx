import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number; // Quantity selected by buyer
  availableQuantity: number; // Max stock from farmer
  quantity_unit: string;
  image_url: string;
  farmer_id: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('agrein_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart storage', error);
      }
    }
  }, []);

  // Save cart to localStorage on modification
  useEffect(() => {
    localStorage.setItem('agrein_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product_id === newItem.product_id);
      if (existing) {
        const newQty = existing.quantity + newItem.quantity;
        if (newQty > newItem.availableQuantity) {
          toast.error(`Cannot add more. Max available stock is ${newItem.availableQuantity} ${newItem.quantity_unit}.`);
          return prevCart;
        }
        toast.success(`Updated ${newItem.name} quantity in cart.`);
        return prevCart.map((i) =>
          i.product_id === newItem.product_id ? { ...i, quantity: newQty } : i
        );
      }
      toast.success(`${newItem.name} added to cart.`);
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product_id === productId);
      if (item) {
        toast.success(`${item.name} removed from cart.`);
      }
      return prevCart.filter((i) => i.product_id !== productId);
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product_id === productId) {
          if (qty > item.availableQuantity) {
            toast.error(`Cannot select more than ${item.availableQuantity} ${item.quantity_unit}.`);
            return item;
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('agrein_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

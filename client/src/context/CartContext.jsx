import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'ffm_guest_cart';

const emptyCart = { items: [], itemCount: 0, subtotal: 0, total: 0 };

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  const formatGuestCart = useCallback(async () => {
    const guestItems = readGuestCart();
    if (guestItems.length === 0) {
      setCart(emptyCart);
      return;
    }

    const detailed = [];
    for (const item of guestItems) {
      try {
        const { data } = await api.get(`/products/${item.productId}`);
        const product = data.product;
        const quantity = Math.min(item.quantity, product.stock);
        if (quantity < 1) continue;
        detailed.push({
          itemId: product._id,
          productId: product._id,
          name: product.name,
          image: product.image,
          brand: product.brand,
          category: product.category,
          price: product.price,
          stock: product.stock,
          quantity,
          lineTotal: product.price * quantity,
        });
      } catch {
        /* skip missing products */
      }
    }

    const itemCount = detailed.reduce((s, i) => s + i.quantity, 0);
    const subtotal = detailed.reduce((s, i) => s + i.lineTotal, 0);
    setCart({ items: detailed, itemCount, subtotal, total: subtotal });
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      await formatGuestCart();
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, formatGuestCart, toast]);

  useEffect(() => {
    if (authLoading) return;

    const sync = async () => {
      if (isAuthenticated) {
        const guestItems = readGuestCart();
        if (guestItems.length > 0) {
          try {
            const { data } = await api.post('/cart/sync', { items: guestItems });
            setCart(data.cart);
            writeGuestCart([]);
          } catch {
            await refreshCart();
          }
        } else {
          await refreshCart();
        }
      } else {
        await formatGuestCart();
      }
    };

    sync();
  }, [isAuthenticated, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      const guestItems = readGuestCart();
      const existing = guestItems.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestItems.push({ productId, quantity });
      }
      writeGuestCart(guestItems);
      await formatGuestCart();
      toast.success('Added to cart');
      return;
    }

    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data.cart);
    toast.success('Added to cart');
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      const guestItems = readGuestCart();
      const item = guestItems.find((i) => i.productId === itemId);
      if (item) {
        item.quantity = quantity;
        writeGuestCart(guestItems.filter((i) => i.quantity > 0));
      }
      await formatGuestCart();
      return;
    }

    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setCart(data.cart);
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) {
      writeGuestCart(readGuestCart().filter((i) => i.productId !== itemId));
      await formatGuestCart();
      toast.info('Item removed');
      return;
    }

    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data.cart);
    toast.info('Item removed');
  };

  const clearLocalCart = () => {
    writeGuestCart([]);
    setCart(emptyCart);
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      refreshCart,
      clearLocalCart,
      itemCount: cart.itemCount || 0,
    }),
    [cart, loading, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

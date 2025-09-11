import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import type { ProductStoreType } from '@/types';

// Cart State Interface
interface CartState {
  cartItems: ProductStoreType[];
  totalItems: number;
  totalPrice: number;
}

// Cart Action Types
type CartAction =
  | { type: 'ADD_PRODUCT'; payload: { product: ProductStoreType; count: number } }
  | { type: 'REMOVE_PRODUCT'; payload: { product: ProductStoreType } }
  | { type: 'SET_COUNT'; payload: { product: ProductStoreType; count: number } }
  | { type: 'UPDATE_VARIANT'; payload: { product: ProductStoreType; colorId?: string; colorName?: string; colorHexCode?: string; size?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: ProductStoreType[] };

// Cart Context Interface
interface CartContextType {
  state: CartState;
  addProduct: (product: ProductStoreType, count: number) => void;
  removeProduct: (product: ProductStoreType) => void;
  setCount: (product: ProductStoreType, count: number) => void;
  updateVariant: (product: ProductStoreType, updates: { colorId?: string; colorName?: string; colorHexCode?: string; size?: string }) => void;
  clearCart: () => void;
  getProductCount: (product: ProductStoreType) => number;
}

// Initial State
const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const { product, count } = action.payload;
      const existingIndex = state.cartItems.findIndex(
        item => item.id === product.id && item.colorId === product.colorId && item.size === product.size
      );

      if (existingIndex !== -1) {
        const updatedItems = [...state.cartItems];
        updatedItems[existingIndex].count += count;

        return {
          ...state,
          cartItems: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.count, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.count), 0),
        };
      }

      const newProduct = { ...product, count };
      const newItems = [...state.cartItems, newProduct];

      return {
        ...state,
        cartItems: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.count, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.count), 0),
      };
    }

    case 'REMOVE_PRODUCT': {
      const { product } = action.payload;
      const filteredItems = state.cartItems.filter(
        item => !(item.id === product.id && item.colorId === product.colorId && item.size === product.size)
      );

      return {
        ...state,
        cartItems: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.count, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + (item.price * item.count), 0),
      };
    }

    case 'SET_COUNT': {
      const { product, count } = action.payload;
      const updatedItems = state.cartItems.map(item =>
        item.id === product.id && item.colorId === product.colorId && item.size === product.size
          ? { ...item, count }
          : item
      );

      return {
        ...state,
        cartItems: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.count, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.count), 0),
      };
    }

    case 'UPDATE_VARIANT': {
      const { product, colorId, colorName, colorHexCode, size } = action.payload;
      const updatedItems = state.cartItems.map(item =>
        item.id === product.id && item.colorId === product.colorId && item.size === product.size
          ? {
              ...item,
              colorId: colorId || item.colorId,
              colorName: colorName || item.colorName,
              colorHexCode: colorHexCode || item.colorHexCode,
              size: size || item.size
            }
          : item
      );

      return {
        ...state,
        cartItems: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.count, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.count), 0),
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'LOAD_CART': {
      const items = action.payload;
      return {
        ...state,
        cartItems: items,
        totalItems: items.reduce((sum, item) => sum + item.count, 0),
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.count), 0),
      };
    }

    default:
      return state;
  }
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}


export const CartProvider: React.FC<CartProviderProps> = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session } = useSession();
  const prevUserId = useRef<string | null>(null);

  // Helper to get cart key for current user
  const getCartKey = () => {
    if (session?.user?.id) return `smile-cart-${session.user.id}`;
    return 'smile-cart-guest';
  };

  // Load cart from localStorage on mount or when user changes
  useEffect(() => {
    const userId = session?.user?.id || null;
    let cartKey = 'smile-cart-guest';
    if (userId) cartKey = `smile-cart-${userId}`;
    if (prevUserId.current !== userId) {
      try {
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        } else if (userId) {
          // Only clear cart if user logs in and has no cart
          dispatch({ type: 'CLEAR_CART' });
        }
        // If guest and no cart, do not clear (keep in-memory cart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
      prevUserId.current = userId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(), JSON.stringify(state.cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cartItems, session?.user?.id]);

  // Helper function to find product count
  const getProductCount = (product: ProductStoreType): number => {
    const item = state.cartItems.find(
      (item: ProductStoreType) => item.id === product.id && item.colorId === product.colorId && item.size === product.size
    );
    return item ? item.count : 0;
  };

  const value: CartContextType = {
    state,
    addProduct: (product: ProductStoreType, count: number) => {
      dispatch({ type: 'ADD_PRODUCT', payload: { product, count } });
    },
    removeProduct: (product: ProductStoreType) => {
      dispatch({ type: 'REMOVE_PRODUCT', payload: { product } });
    },
    setCount: (product: ProductStoreType, count: number) => {
      dispatch({ type: 'SET_COUNT', payload: { product, count } });
    },
    updateVariant: (product: ProductStoreType, updates: { colorId?: string; colorName?: string; colorHexCode?: string; size?: string }) => {
      dispatch({ type: 'UPDATE_VARIANT', payload: { product, ...updates } });
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    getProductCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom Hook to use Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

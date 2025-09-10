import React, { createContext, useContext, ReactNode } from 'react';

// UI State Interface
interface UIState {
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  isLoading: boolean;
  notifications: NotificationItem[];
}

// Notification Item Interface
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// UI Action Types
type UIAction =
  | { type: 'TOGGLE_MENU' }
  | { type: 'SET_MENU_OPEN'; payload: boolean }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'SET_SEARCH_OPEN'; payload: boolean }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'OPEN_MODAL'; payload: ReactNode }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<NotificationItem, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// UI Context Interface
interface UIContextType {
  state: UIState;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<NotificationItem, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Initial State
const initialState: UIState = {
  isMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  isModalOpen: false,
  modalContent: null,
  isLoading: false,
  notifications: [],
};

// UI Reducer
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen };

    case 'SET_MENU_OPEN':
      return { ...state, isMenuOpen: action.payload };

    case 'TOGGLE_SEARCH':
      return { ...state, isSearchOpen: !state.isSearchOpen };

    case 'SET_SEARCH_OPEN':
      return { ...state, isSearchOpen: action.payload };

    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };

    case 'SET_CART_OPEN':
      return { ...state, isCartOpen: action.payload };

    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, modalContent: action.payload };

    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, modalContent: null };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'ADD_NOTIFICATION': {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification = { ...action.payload, id };
      return { ...state, notifications: [...state.notifications, newNotification] };
    }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    default:
      return state;
  }
};

// Create Context
const UIContext = createContext<UIContextType | undefined>(undefined);

// UI Provider Component
interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);

  const toggleMenu = () => dispatch({ type: 'TOGGLE_MENU' });
  const setMenuOpen = (open: boolean) => dispatch({ type: 'SET_MENU_OPEN', payload: open });

  const toggleSearch = () => dispatch({ type: 'TOGGLE_SEARCH' });
  const setSearchOpen = (open: boolean) => dispatch({ type: 'SET_SEARCH_OPEN', payload: open });

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const setCartOpen = (open: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: open });

  const openModal = (content: ReactNode) => dispatch({ type: 'OPEN_MODAL', payload: content });
  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });

  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });

  const addNotification = (notification: Omit<NotificationItem, 'id'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    // Note: If you want to auto-remove, you need to know the generated id. For now, this only adds the notification.
  };

  const removeNotification = (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  const clearNotifications = () => dispatch({ type: 'CLEAR_NOTIFICATIONS' });

  const value: UIContextType = {
    state,
    toggleMenu,
    setMenuOpen,
    toggleSearch,
    setSearchOpen,
    toggleCart,
    setCartOpen,
    openModal,
    closeModal,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// Custom Hook to use UI Context
export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

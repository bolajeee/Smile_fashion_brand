import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// User types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    language: string;
    currency: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
}

// User State Interface
interface UserState {
    user: User | null;
    preferences: UserPreferences;
    favoriteProducts: string[];
    isLoading: boolean;
    error: string | null;
}

// User Action Types
type UserAction =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_PREFERENCES'; payload: Partial<UserPreferences> }
    | { type: 'TOGGLE_FAVORITE_PRODUCT'; payload: string }
    | { type: 'SET_FAVORITE_PRODUCTS'; payload: string[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'CLEAR_ERROR' }
    | { type: 'LOGOUT' };

// User Context Interface
interface UserContextType {
    state: UserState;
    setUser: (user: User | null) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    toggleFavoriteProduct: (productId: string) => void;
    setFavoriteProducts: (productIds: string[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

// Default User Preferences
const defaultPreferences: UserPreferences = {
    theme: 'light',
    language: 'en',
    currency: 'USD',
    notifications: {
        email: true,
        push: false,
        sms: false,
    },
};

// Initial State
const initialState: UserState = {
    user: null,
    preferences: defaultPreferences,
    favoriteProducts: [],
    isLoading: false,
    error: null,
};

// User Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload, error: null };

        case 'SET_PREFERENCES':
            return {
                ...state,
                preferences: { ...state.preferences, ...action.payload },
            };

        case 'TOGGLE_FAVORITE_PRODUCT': {
            const productId = action.payload;
            const isFavorite = state.favoriteProducts.includes(productId);

            if (isFavorite) {
                return {
                    ...state,
                    favoriteProducts: state.favoriteProducts.filter(id => id !== productId),
                };
            } else {
                return {
                    ...state,
                    favoriteProducts: [...state.favoriteProducts, productId],
                };
            }
        }

        case 'SET_FAVORITE_PRODUCTS':
            return { ...state, favoriteProducts: action.payload };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'CLEAR_ERROR':
            return { ...state, error: null };

        case 'LOGOUT':
            return {
                ...initialState,
                preferences: state.preferences, // Keep preferences on logout
            };

        default:
            return state;
    }
};

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User Provider Component
interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const [state, dispatch] = React.useReducer(userReducer, initialState);

    // Load user preferences from localStorage on mount
    useEffect(() => {
        try {
            const savedPreferences = localStorage.getItem('smile-user-preferences');
            if (savedPreferences) {
                const parsedPreferences = JSON.parse(savedPreferences);
                dispatch({ type: 'SET_PREFERENCES', payload: parsedPreferences });
            }
        } catch (error) {
            console.error('Error loading user preferences from localStorage:', error);
        }
    }, []);

    // Save preferences to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('smile-user-preferences', JSON.stringify(state.preferences));
        } catch (error) {
            console.error('Error saving user preferences to localStorage:', error);
        }
    }, [state.preferences]);

    // Update user when session changes
    useEffect(() => {
        if (status === 'loading') {
            dispatch({ type: 'SET_LOADING', payload: true });
            return;
        }

        if (status === 'authenticated' && session?.user) {
            const user: User = {
                id: session.user.id || '',
                name: session.user.name || '',
                email: session.user.email || '',
                role: (session.user.role as 'USER' | 'ADMIN') || 'USER',
                avatar: session.user.image || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            dispatch({ type: 'SET_USER', payload: user });
        } else if (status === 'unauthenticated') {
            dispatch({ type: 'SET_USER', payload: null });
        }

        dispatch({ type: 'SET_LOADING', payload: false });
    }, [session, status]);

    const setUser = (user: User | null) => {
        dispatch({ type: 'SET_USER', payload: user });
    };

    const updatePreferences = (preferences: Partial<UserPreferences>) => {
        dispatch({ type: 'SET_PREFERENCES', payload: preferences });
    };

    const toggleFavoriteProduct = (productId: string) => {
        dispatch({ type: 'TOGGLE_FAVORITE_PRODUCT', payload: productId });
    };

    const setFavoriteProducts = (productIds: string[]) => {
        dispatch({ type: 'SET_FAVORITE_PRODUCTS', payload: productIds });
    };

    const setLoading = (loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const value: UserContextType = {
        state,
        setUser,
        updatePreferences,
        toggleFavoriteProduct,
        setFavoriteProducts,
        setLoading,
        setError,
        clearError,
        logout,
        isAuthenticated: !!state.user,
        isAdmin: state.user?.role === 'ADMIN',
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom Hook to use User Context
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

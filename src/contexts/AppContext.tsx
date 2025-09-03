import React, { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { ThemeProvider } from './ThemeContext';
import { UIProvider } from './UIContext';
import { UserProvider } from './UserContext';

// App Context Provider Props
interface AppContextProviderProps {
    children: ReactNode;
}

// Main App Context Provider that combines all other contexts
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <UserProvider>
                <CartProvider>
                    <UIProvider>
                        {children}
                    </UIProvider>
                </CartProvider>
            </UserProvider>
        </ThemeProvider>
    );
};

// Re-export all context hooks for convenience
export { useCart } from './CartContext';
export { useTheme } from './ThemeContext';
export { useUI } from './UIContext';
export { useUser } from './UserContext';

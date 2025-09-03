# Context System for Smile Fashion Brand

This directory contains all the React Context providers and hooks for managing application state. The context system provides a clean, organized way to manage global state without prop drilling.

## Overview

The context system is built using React's built-in Context API and follows modern React patterns with TypeScript support. It provides:

- **Cart Management**: Shopping cart state, add/remove products, quantity management
- **Theme Management**: Light/dark theme switching with localStorage persistence
- **UI State**: Modal states, loading states, notifications, and UI interactions
- **User Management**: User authentication, preferences, and profile data
- **Unified Provider**: Single `AppContextProvider` that wraps all contexts

## Context Architecture

```
AppContextProvider
├── ThemeProvider
├── UserProvider
├── CartProvider
└── UIProvider
```

## Available Contexts

### 1. CartContext (`useCart`)

Manages shopping cart state and operations.

**State:**
- `cartItems`: Array of products in cart
- `totalItems`: Total number of items
- `totalPrice`: Total cart value

**Actions:**
- `addProduct(product, count)`: Add product to cart
- `removeProduct(product)`: Remove product from cart
- `setCount(product, count)`: Update product quantity
- `clearCart()`: Empty the cart
- `getProductCount(product)`: Get current quantity of a product

**Usage:**
```tsx
import { useCart } from '@/contexts/AppContext';

function ProductCard({ product }) {
  const { addProduct, getProductCount } = useCart();
  const currentCount = getProductCount(product);
  
  return (
    <button onClick={() => addProduct(product, 1)}>
      Add to Cart ({currentCount})
    </button>
  );
}
```

### 2. ThemeContext (`useTheme`)

Manages application theme (light/dark) with system preference detection.

**State:**
- `theme`: Current theme ('light' | 'dark')

**Actions:**
- `toggleTheme()`: Switch between themes
- `setTheme(theme)`: Set specific theme

**Usage:**
```tsx
import { useTheme } from '@/contexts/AppContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### 3. UIContext (`useUI`)

Manages UI state like modals, loading states, and notifications.

**State:**
- `isMenuOpen`, `isSearchOpen`, `isCartOpen`: UI panel states
- `isModalOpen`, `modalContent`: Modal state
- `isLoading`: Global loading state
- `notifications`: Array of notification messages

**Actions:**
- `toggleMenu()`, `setMenuOpen(open)`: Menu state
- `toggleSearch()`, `setSearchOpen(open)`: Search state
- `toggleCart()`, `setCartOpen(open)`: Cart state
- `openModal(content)`, `closeModal()`: Modal control
- `setLoading(loading)`: Loading state
- `addNotification(notification)`: Show notification
- `removeNotification(id)`: Remove notification

**Usage:**
```tsx
import { useUI } from '@/contexts/AppContext';

function Header() {
  const { toggleMenu, isMenuOpen } = useUI();
  
  return (
    <button onClick={toggleMenu}>
      Menu {isMenuOpen ? 'Open' : 'Closed'}
    </button>
  );
}
```

### 4. UserContext (`useUser`)

Manages user authentication, preferences, and profile data.

**State:**
- `user`: Current user object or null
- `preferences`: User preferences (theme, language, etc.)
- `favoriteProducts`: Array of favorite product IDs
- `isLoading`: Authentication loading state
- `error`: Authentication errors

**Actions:**
- `setUser(user)`: Set current user
- `updatePreferences(preferences)`: Update user preferences
- `toggleFavoriteProduct(productId)`: Toggle product favorite
- `setFavoriteProducts(productIds)`: Set all favorites
- `logout()`: Clear user data
- `isAuthenticated`: Boolean for auth state
- `isAdmin`: Boolean for admin role

**Usage:**
```tsx
import { useUser } from '@/contexts/AppContext';

function UserProfile() {
  const { user, isAuthenticated, logout } = useUser();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Setup and Usage

### 1. Wrap Your App

Wrap your application with the `AppContextProvider` in your main layout or `_app.tsx`:

```tsx
// pages/_app.tsx or layouts/Main.tsx
import { AppContextProvider } from '@/contexts/AppContext';

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
```

### 2. Use Contexts in Components

Import and use the context hooks in your components:

```tsx
import { useCart, useTheme, useUI, useUser } from '@/contexts/AppContext';

function MyComponent() {
  const { cartItems, addProduct } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { isLoading, setLoading } = useUI();
  const { user, isAuthenticated } = useUser();
  
  // Use the context values and actions
  return (
    <div>
      <p>Cart items: {cartItems.length}</p>
      <button onClick={toggleTheme}>Theme: {theme}</button>
      {isAuthenticated && <p>Welcome, {user.name}</p>}
    </div>
  );
}
```

## Benefits of Context vs Redux

### Context API Advantages:
- **Built-in**: No external dependencies
- **Lightweight**: Smaller bundle size
- **Simple**: Easier to understand and implement
- **TypeScript**: Better type inference
- **React Native**: Works seamlessly with React Native

### When to Use Context:
- **Small to Medium Apps**: Perfect for most e-commerce applications
- **Simple State**: When state logic is straightforward
- **Team Familiarity**: When team prefers React patterns
- **Performance**: When you don't need Redux's advanced optimizations

### When to Consider Redux:
- **Large Apps**: Complex state management requirements
- **Advanced Features**: Need for middleware, dev tools, time-travel debugging
- **Team Experience**: Team already familiar with Redux
- **Performance**: Need for advanced performance optimizations

## Best Practices

### 1. Keep Contexts Focused
Each context should handle a specific domain:
- CartContext: Only cart-related state
- ThemeContext: Only theme-related state
- UserContext: Only user-related state

### 2. Use Custom Hooks
Always use the provided custom hooks instead of accessing context directly:
```tsx
// ✅ Good
const { addProduct } = useCart();

// ❌ Bad
const cartContext = useContext(CartContext);
const { addProduct } = cartContext;
```

### 3. Optimize Re-renders
Use `useMemo` and `useCallback` in context providers when needed:
```tsx
const value = useMemo(() => ({
  state,
  actions
}), [state, actions]);
```

### 4. Handle Loading States
Always check loading states before rendering:
```tsx
const { user, isLoading } = useUser();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!user) {
  return <LoginForm />;
}
```

## Migration from Redux

If you're migrating from Redux, the context system provides similar functionality:

**Redux → Context Mapping:**
- `useSelector` → Direct context state access
- `useDispatch` → Direct context action calls
- `Provider` → `AppContextProvider`
- `combineReducers` → Multiple context providers

**Example Migration:**
```tsx
// Before (Redux)
const cartItems = useSelector(state => state.cart.cartItems);
const dispatch = useDispatch();
dispatch(addProduct(product));

// After (Context)
const { state: { cartItems }, addProduct } = useCart();
addProduct(product);
```

## Troubleshooting

### Common Issues:

1. **Context Not Available**
   - Ensure `AppContextProvider` wraps your component tree
   - Check import paths are correct

2. **Infinite Re-renders**
   - Check for circular dependencies in context values
   - Use `useMemo` for complex context values

3. **State Not Persisting**
   - Check localStorage permissions
   - Verify localStorage key names

4. **TypeScript Errors**
   - Ensure all context types are properly exported
   - Check for missing type definitions

## Performance Considerations

- **Context Splitting**: Each context is independent, preventing unnecessary re-renders
- **Selective Updates**: Only components using specific contexts re-render
- **Memoization**: Use React.memo for expensive components
- **Lazy Loading**: Load contexts only when needed

## Future Enhancements

Potential improvements for the context system:
- **Context Persistence**: More sophisticated state persistence
- **Middleware Support**: Add middleware-like functionality
- **Dev Tools**: Integration with React DevTools
- **Performance Monitoring**: Add performance tracking
- **Testing Utilities**: Helper functions for testing contexts

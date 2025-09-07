## Component Organization

The frontend components are organized as follows:

### Product Components
Located in `src/components/product/`:
- `card/` - Product card used in listings
  - `index.tsx` - Main product card component with image optimization
  - `loading.tsx` - Loading skeleton
- `details/` - Product detail page components
  - `gallery.tsx` - Product image gallery with thumbnails
  - `content.tsx` - Product information and purchase actions

### Layout Components
- `Main.tsx` - Main layout with header and footer
- `404.tsx` - Not found page layout

### Cart & Checkout Components
- `shopping-cart/` - Shopping cart components
- `checkout/` - Checkout process components
- `checkout-status/` - Order status indicators

### Common Components
- `breadcrumb/` - Page navigation breadcrumbs
- `footer/` - Site footer
- `header/` - Site header with navigation
- `page-intro/` - Page introduction sections
- `subscribe/` - Newsletter subscription
- `features/` - Feature highlights

## Available Routes

### Public Routes
- `/` - Homepage with featured products
- `/product` - Product listing page with filters
- `/product/[pid]` - Product detail page
- `/cart` - Shopping cart page
- `/cart/checkout` - Checkout process
- `/login` - User login
- `/register` - New user registration
- `/forgot-password` - Password recovery

### User Routes (Protected)
- `/account/profile` - User profile management
- `/account/edit-profile` - Edit profile details
- `/checkout-success` - Order confirmation

### Admin Routes (Protected)
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/add` - Add new product
- `/admin/products/edit/[id]` - Edit existing product
- `/admin/orders` - Order management
- `/admin/settings` - Admin settings
- `/admin/featured/products` - Featured products management

### Style Organization
Using the 7-1 SCSS pattern:
```
src/assets/css/
├── abstracts/   # Variables, mixins, functions
├── base/        # Base styles, reset, typography
├── components/  # Component styles
├── layout/     # Layout styles
├── pages/      # Page-specific styles
├── themes/     # Theme variations
└── styles.scss # Main stylesheet
```

## Development Setup

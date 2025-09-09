# Smile Fashion Brand 🛍️

A modern, full-featured e-commerce platform built with Next.js 13+, TypeScript, and Prisma, featuring a beautiful dark mode design and responsive UI.

[![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-green)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 Modern, responsive UI with dark mode support
- 🛒 Full e-commerce functionality with cart and checkout
- 🔐 Secure authentication with NextAuth.js
- 📱 Mobile-first design approach
- 🎯 Advanced product filtering and search
- ⚡ Optimized performance with Next.js
- 🔄 Real-time cart updates
- 📦 Dynamic product management
- 🌙 Beautiful dark mode implementation
- 🎉 Interactive UI elements and animations

## Documentation

- [Frontend Components & Routes](./docs/FRONTEND.md)
- [Backend & API Guide](#backend--api-guide)

## Backend & API Guide

This project is a Next.js e-commerce app using PostgreSQL with Prisma as the ORM. The backend exposes RESTful API routes under `src/pages/api` for products, users, orders, order items, and order status (enum values).

### Prerequisites
- Node.js 18+
- PostgreSQL (local or remote)

### Environment Setup
Create a `.env` file in the project root with the following configuration:

```env
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars"  # Generate with: openssl rand -base64 32

# Admin Seeding Configuration (for npm run seed)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password"
ADMIN_NAME="Admin User"
```

Replace the placeholders with your actual values:
- `USER`: Your PostgreSQL username
- `PASSWORD`: Your PostgreSQL password
- `HOST`: Database host (usually localhost for local development)
- `DBNAME`: Your database name (e.g., "smileDb")
- `NEXTAUTH_SECRET`: A secure random string for session encryption
- Admin credentials for seeding (these will be used to create the admin user)

### Install & Run
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Setup DB (apply migrations)
npx prisma migrate dev

# Seed the database with admin user
npm run seed

# Start the development server
npm run dev
```

### Creating Admin User
The project includes a seed script that creates an admin user based on the environment variables. To create an admin user:

1. Ensure your `.env` file includes the admin configuration:
   ```env
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-admin-password"
   ADMIN_NAME="Admin User"
   ```

2. Run the seed command:
   ```bash
   npm run seed
   ```

This will create an admin user with the specified credentials. You can then log in using these credentials to access admin features.

Note: If you need to reset the database and recreate the admin user:
```bash
npx prisma migrate reset --force  # This will also run the seed script
```

### Database & Prisma
- Schema is defined in `prisma/schema.prisma` with models: `User`, `Product`, `Order`, `OrderItem`, and enum `OrderStatus`.
- Migrations live in `prisma/migrations/`.
- Prisma client singleton is in `src/utils/db.ts` and is reused across API routes.

### Data Models (high-level)
- `User`: `id`, `name`, `email`, `passwordHash`, `address`, `orders[]`
- `Product`: `id`, `name`, `description`, `price (Decimal 12,2)`, `images (String[])`, `stock`, timestamps
- `Order`: `id`, `userId`, `status (OrderStatus)`, `total (Decimal 12,2)`, `shippingAddress`, `items[]`
- `OrderItem`: `id`, `orderId`, `productId`, `quantity`, `price (Decimal 12,2)`
- `OrderStatus` enum: `PENDING | SHIPPED | DELIVERED | CANCELLED`

### API Endpoints
Base path: `/api`

#### Products
- `GET /api/products` – list products
- `POST /api/products` – create product
  - Body: `{ name, description, price, images?, stock }`
- `GET /api/product/:id` – get one product
- `PUT /api/product/:id` – update product
- `DELETE /api/product/:id` – delete product
- `GET /api/products/featured` – get featured products in display order
- `PATCH /api/products/featured/:id` – toggle product featured status
  - Body: `{ featured: boolean, featuredOrder?: number }`
- `PATCH /api/products/featured/reorder` – reorder featured products
  - Body: `{ orderedIds: Array<{ id: string, order: number }> }`

Example (create):
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Tee",
    "description":"Cotton tee",
    "price":"29.99",
    "images":["/images/tee.jpg"],
    "stock":25
  }'
```

#### Users
- `GET /api/users` – list users (safe fields only)
- `POST /api/users` – create user
  - Body: `{ name, email, passwordHash, address }`
- `GET /api/user/:id` – get one user (safe fields only)
- `PUT /api/user/:id` – update user (safe fields only in response)
- `DELETE /api/user/:id` – delete user

#### Orders
- `GET /api/orders` – list orders (includes `items` and `user`)
- `POST /api/orders` – create order (optionally with items)
  - Body: `{ userId, total, shippingAddress, status?, items?: [{ productId, quantity, price }] }`
- `GET /api/order/:id` – get one order (includes `items` and `user`)
- `PUT /api/order/:id` – update order (e.g., `status`)
- `DELETE /api/order/:id` – delete order

Update status example:
```bash
curl -X PUT http://localhost:3000/api/order/ORDER_ID \
  -H "Content-Type: application/json" \
  -d '{ "status": "SHIPPED" }'
```

#### Order Items
- `GET /api/order-items` – list order items
- `POST /api/order-items` – create order item
  - Body: `{ productId, orderId, quantity, price }`
- `GET /api/order-item/:id` – get one order item
- `PUT /api/order-item/:id` – update order item
- `DELETE /api/order-item/:id` – delete order item

#### Order Status (Enum)
- `GET /api/order-status` – returns available enum values
- `GET /api/order-status/:value` – validates a value and returns `{ value, valid }`

### Conventions & Error Handling
- All write routes perform basic validation and return `400` on missing required fields.
- `:id` params are normalized and return `400` if missing, `404` if not found.
- Unexpected errors return `500` with a generic message.

### Security
- User responses never include `passwordHash`.
- Add authentication/authorization before exposing write endpoints publicly.

### Frontend Integration & UI Components

#### Component Architecture
- **Atomic Design Methodology**: Components are organized following atomic design principles
- **Reusable Components**: Modular components with consistent styling and behavior
- **Interactive Elements**: Rich interactions and animations for better user experience

#### Styling System
- **SCSS Modules**: Organized SCSS with BEM methodology
- **CSS Variables**: Comprehensive theming system with CSS custom properties
- **Dark Mode**: Full dark mode support with seamless transitions
- **Responsive Design**: Mobile-first approach with fluid typography and spacing
- **Animation System**: Consistent animations and transitions throughout

#### Key Components
- **Header**: Responsive header with dynamic logo, theme toggle, and mobile menu
- **Product Cards**: Interactive cards with hover effects and quick actions
- **Featured Section**: Carousel-based featured products section
- **Cart Interface**: Dynamic cart with real-time updates
- **Form Components**: Styled form elements with validation feedback
- **Buttons & Icons**: Consistent button styles and icon system

#### Data Fetching
- Product lists use `/api/products` via SWR for real-time updates
- Static catalog helpers in `src/utils/data` for colors, sizes, and types
- Optimized image loading with Next.js Image component

### Admin Features
- **Product Management**: `/admin/products` - View, edit, and delete products (admin only)
- **Add Products**: `/add-product` - Create new products with form validation
- **Featured Products**: `/admin/featured-products` - Manage featured products with drag-and-drop reordering

### E-commerce Flow
- **Shopping Cart**: Redux-based cart with persistent state
- **Checkout Process**: Integrated with orders API, creates orders with items
- **Order History**: User profile shows complete order history with status tracking
- **Checkout Success**: `/checkout-success` page after successful order placement

### Authentication & User Management
- **NextAuth.js**: Complete authentication system with credentials provider
- **User Roles**: Admin/User role-based access control
- **Protected Routes**: Account pages require authentication
- **Session Management**: JWT-based sessions with 30-day expiry

### Useful Scripts
```
yarn dev             # run Next.js dev server
yarn build           # build for production
yarn start           # start production server
npx prisma generate  # regenerate Prisma client
npx prisma migrate dev -n "message"  # create/apply dev migration
```

### Troubleshooting
- Drift or migration issues in dev: `npx prisma migrate reset --force --skip-seed` then `npx prisma migrate dev`.
- Ensure `DATABASE_URL` is set and reachable.
- For Prisma client generation issues on Windows, try:
  ```bash
  taskkill /F /IM node.exe
  rm -r -force node_modules\.prisma
  npm install --legacy-peer-deps
  npx prisma generate
  ```

### Development Workflow

#### Getting Started
1. Clone the repository
   ```bash
   git clone https://github.com/bolajeee/Smile_fashion_brand.git
   cd Smile_fashion_brand
   ```

2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   ```

3. Setup environment
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Setup database
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

5. Start development server
   ```bash
   npm run dev
   ```

#### Best Practices
- Follow the BEM methodology for CSS classes
- Use TypeScript for all new code
- Maintain dark mode compatibility
- Keep components modular and reusable
- Document new features and changes

#### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices and hooks guidelines
- Maintain consistent naming conventions
- Write meaningful commit messages

### Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- All contributors who have helped shape this project

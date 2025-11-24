# LeBonCoinCoin Frontend - Classified Ads Platform

A modern, minimal React frontend for a classified-ads platform built with **Vite**, **React**, **TypeScript**, **Material UI**, and **Clerk** authentication. 🦆

## 🎨 Features

- **Home Page**: Browse all listings with advanced filters
- **Listing Details**: View detailed information about each listing, send messages
- **Create Listing**: Post new ads with image upload to S3
- **User Profile**: View and manage your listings, view favorites
- **Messaging**: Real-time messaging system between buyers and sellers
- **Favorites**: Save listings to your favorites list
- **Authentication**: Secure login/signup with Clerk

## 🏗️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: Material UI (MUI) v6
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **Routing**: React Router v6

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ListingCard.tsx
│   │   ├── ListingFilters.tsx
│   │   ├── ConversationList.tsx
│   │   └── MessageList.tsx
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── ListingDetailPage.tsx
│   │   ├── CreateListingPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ConversationPage.tsx
│   │   └── FavoritesPage.tsx
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── conversation.service.ts
│   │   └── favorite.service.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── theme.ts           # MUI theme configuration
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
VITE_API_BASE_URL=http://localhost:8080/api
```

Get your Clerk publishable key from: https://dashboard.clerk.com

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:5173

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📡 API Integration

The frontend communicates with the backend API through the `/api` proxy configured in Vite.

### API Endpoints Used

- `GET /api/listings` - Fetch all listings
- `GET /api/listings/:id` - Fetch single listing
- `POST /api/listings` - Create new listing (authenticated)
- `DELETE /api/listings/:id` - Delete listing (authenticated)
- `GET /api/me` - Get current user (authenticated)
- `GET /api/me/listings` - Get current user's listings (authenticated)
- `POST /api/uploads/presigned-url` - Get S3 presigned URL (authenticated)
- `GET /api/conversations` - Get conversations (authenticated)
- `GET /api/favorites` - Get favorites (authenticated)

## 🔐 Authentication Flow

1. User clicks "Connexion" or "Inscription"
2. Clerk handles the authentication UI and flow
3. On successful auth, JWT token is obtained
4. Token is automatically added to API requests via `setAuthToken()`
5. Protected routes check authentication status before rendering

## 📱 Pages Overview

### Home Page (`/`)
- Displays all listings in a grid
- Advanced filtering by category, location, price, and search term
- Responsive design with Material UI Grid

### Listing Detail (`/listings/:id`)
- Full listing information with image gallery
- Delete button for listing owners
- "Envoyer un message" button for buyers
- "Ajouter aux favoris" button
- Responsive layout with sidebar

### Create Listing (`/create`)
- Protected route (requires authentication)
- Form with validation
- Image upload to S3 via presigned URLs
- Real-time image preview

### Profile (`/profile`)
- Protected route (requires authentication)
- User information from Clerk
- Grid of user's listings
- Quick access to manage listings

### Messages (`/messages`)
- List of conversations
- Real-time chat interface

### Favorites (`/favorites`)
- List of saved listings

## 🎨 Styling & Theme

The app uses a custom Material UI theme defined in `src/theme.ts`:

- **Primary Color**: Orange (#ff6e14) - LeBonCoinCoin Brand Color
- **Secondary Color**: Blue (#4183c4)
- **Typography**: System fonts with custom weights
- **Components**: Customized buttons and cards

## 🖼️ Image Upload Flow

1. User selects images in the create listing form
2. Frontend requests presigned URL from backend
3. Backend generates presigned S3 URL and returns it
4. Frontend uploads directly to S3 using the presigned URL
5. Public URL is stored with the listing

## 🚢 Production Build

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Deploy to Netlify/Vercel

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in dashboard

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |
| `VITE_API_BASE_URL` | Backend API URL | `https://api.leboncoincoin.com/api` |

## 🧪 Development Notes

- Hot Module Replacement (HMR) is enabled by default
- TypeScript strict mode is enabled
- Path aliases configured: `@/` points to `src/`
- API requests are proxied through Vite dev server

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.


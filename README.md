# SANS Store - Frontend Application

![React](https://img.shields.io/badge/React-19.2.1-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.18-06B6D4)
![License](https://img.shields.io/badge/license-ISC-green)

A modern, production-ready e-commerce frontend application built with React and TailwindCSS.

## 🚀 Features

- **User Authentication** - Login, register, forgot password, and logout functionality
- **Product Browsing** - View products with filters, search, and sorting
- **Shopping Cart** - Add, remove, and manage cart items
- **Wishlist** - Save favorite products for later
- **Categories** - Browse products by category
- **Responsive Design** - Mobile-first design with TailwindCSS
- **Error Handling** - Comprehensive error boundaries and user-friendly error messages
- **SEO Optimized** - Meta tags, Open Graph, and Twitter Cards for better search visibility

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Backend API** running (olshop-backend)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd olshop-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following variables:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_API_TIMEOUT=10000
   REACT_APP_NAME=SANS Store
   REACT_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
olshop-frontend/
├── public/
│   ├── index.html          # HTML template with SEO meta tags
│   ├── robots.txt          # Search engine directives
│   └── ...
├── src/
│   ├── api/                # API client and endpoint modules
│   │   ├── client.js       # Axios instance with interceptors
│   │   ├── auth.api.js     # Authentication endpoints
│   │   ├── product.api.js  # Product endpoints
│   │   └── ...
│   ├── components/         # Reusable components
│   │   ├── common/         # Common components (Loading, ErrorBoundary, etc.)
│   │   ├── layout/         # Layout components (Header, Footer, etc.)
│   │   ├── product/        # Product-related components
│   │   └── ...
│   ├── config/             # Configuration files
│   │   └── constants.js    # App constants and configs
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── WishlistContext.js
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   │   ├── auth/           # Auth pages (Login, Register)
│   │   ├── home/           # Home page
│   │   ├── products/       # Product pages
│   │   └── ...
│   ├── routes/             # Route configuration
│   │   └── AppRoutes.jsx
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── App.js              # Root component
│   └── index.js            # Entry point
├── .env.example            # Environment variables template
├── .env.production         # Production environment variables
├── .env.staging            # Staging environment variables
├── package.json
└── README.md
```

## 🔧 Available Scripts

### Development

```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```
Builds the app for production to the `build` folder. The build is minified and optimized.

### Test

```bash
npm test
```
Launches the test runner in interactive watch mode.

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` | Yes |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `10000` | No |
| `REACT_APP_NAME` | Application name | `SANS Store` | No |
| `REACT_APP_VERSION` | Application version | `1.0.0` | No |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics tracking | `false` | No |
| `REACT_APP_ENABLE_ERROR_TRACKING` | Enable error tracking | `false` | No |

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- **Login**: POST `/api/auth/login`
- **Register**: POST `/api/auth/register`
- **Logout**: POST `/api/auth/logout`

Tokens are stored in `localStorage` and automatically attached to API requests via Axios interceptors.

## 🎨 Styling

This project uses **TailwindCSS** for styling. Customize the theme in `tailwind.config.js`.

### Custom Styles

Global styles are defined in `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🛡️ Error Handling

### ErrorBoundary

The app is wrapped with an `ErrorBoundary` component that catches JavaScript errors and displays a user-friendly fallback UI.

### API Error Handling

API errors are handled in `src/api/client.js` with specific error messages for different HTTP status codes:
- **401**: Session expired, redirect to login
- **403**: Permission denied
- **404**: Resource not found
- **500**: Server error
- **Network errors**: Connection issues

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Building for Production

1. **Update environment variables**
   ```bash
   cp .env.production .env
   # Edit .env with production values
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Deploy the `build` folder** to your hosting service:
   - **Netlify**: Drag and drop the `build` folder
   - **Vercel**: Connect your Git repository
   - **AWS S3**: Upload to S3 bucket and configure CloudFront
   - **Docker**: See `Dockerfile` (if available)

### Important Production Considerations

1. **Update API URL** in `.env.production`
2. **Update sitemap URL** in `public/robots.txt`
3. **Update Open Graph URLs** in `public/index.html`
4. **Enable HTTPS** for security
5. **Configure CORS** on backend to allow your domain

## 🧪 Testing

```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🐛 Troubleshooting

### Common Issues

**Problem**: "Network Error" when making API calls
- **Solution**: Check if backend is running and `REACT_APP_API_URL` is correct

**Problem**: 401 Unauthorized errors
- **Solution**: Token might be expired, try logging in again

**Problem**: Build fails
- **Solution**: Clear cache and reinstall dependencies:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 📦 Dependencies

### Main Dependencies
- **react**: UI library
- **react-dom**: React DOM renderer
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **react-hot-toast**: Toast notifications
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📝 Code Quality

- Follow React best practices
- Use functional components and hooks
- Keep components small and focused
- Write meaningful commit messages
- Add comments for complex logic

## 🔄 Recent Improvements (Production-Ready)

✅ **Fixed critical bugs**: WishlistProvider import, token inconsistency
✅ **Enhanced error handling**: Comprehensive error boundaries and API error handling
✅ **Improved security**: Better token management and expiry handling
✅ **SEO optimized**: Meta tags, Open Graph, Twitter Cards
✅ **Better UX**: Loading states, empty states, error messages
✅ **Configuration**: Centralized constants and environment variables

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## 📄 License

This project is licensed under the ISC License.

---

**Made with ❤️ by SANS Team**

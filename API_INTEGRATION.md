# API Integration Guide

This document explains how the frontend integrates with the backend API.

## 🔗 API Client Configuration

### Base Configuration

The API client is configured in `src/api/client.js`:

```javascript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})
```

### Request Interceptor

Automatically attaches JWT token to all requests:

```javascript
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)
```

### Response Interceptor

Handles errors and unwraps response data:

```javascript
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear tokens and redirect to login
        }
        // Return formatted error message
    }
)
```

## 📡 API Modules

### Authentication API (`src/api/auth.api.js`)

```javascript
export const authApi = {
    // Login
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data; // { accessToken, user }
    },

    // Register
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data; // { accessToken, user }
    },

    // Logout
    logout: async () => {
        return await apiClient.post('/auth/logout');
    },

    // Forgot Password
    forgotPassword: async (email) => {
        return await apiClient.post('/auth/forgot-password', { email });
    },

    // Reset Password
    resetPassword: async (token, newPassword) => {
        return await apiClient.post('/auth/reset-password', { token, newPassword });
    }
}
```

### Product API (`src/api/product.api.js`)

```javascript
export const productApi = {
    // Get all products with filters
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category_id) params.append('category_id', filters.category_id);
        // ... more filters
        
        const response = await apiClient.get(`/products?${params.toString()}`);
        return response.data;
    },

    // Get product by UUID
    getById: async (UUID) => {
        const response = await apiClient.get(`/products/${UUID}`);
        return response.data;
    },

    // Create product (admin)
    create: async (productData) => {
        return await apiClient.post('/products', productData);
    },

    // Update product (admin)
    updateById: async (UUID, productData) => {
        return await apiClient.put(`/products/${UUID}`, productData);
    },

    // Delete product (admin)
    softDeleteById: async (UUID) => {
        return await apiClient.delete(`/products/${UUID}`);
    }
}
```

### Cart API (`src/api/cart.api.js`)

```javascript
export const cartApi = {
    // Get user's cart
    get: async () => {
        const response = await apiClient.get('/cart');
        return response.data;
    },

    // Add item to cart
    addItem: async (productId, quantity) => {
        return await apiClient.post('/cart/items', { productId, quantity });
    },

    // Update cart item
    updateItem: async (itemId, quantity) => {
        return await apiClient.put(`/cart/items/${itemId}`, { quantity });
    },

    // Remove item from cart
    removeItem: async (itemId) => {
        return await apiClient.delete(`/cart/items/${itemId}`);
    },

    // Clear cart
    clear: async () => {
        return await apiClient.delete('/cart');
    }
}
```

## 🔐 Authentication Flow

### 1. Login Flow

```javascript
// In AuthContext.js
const login = async (email, password) => {
    try {
        const data = await authApi.login(email, password);
        
        // Store token and user data
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
```

### 2. Token Storage

Tokens are stored in `localStorage`:
- **Key**: `accessToken`
- **User Data**: `user` (JSON string)

### 3. Token Attachment

Tokens are automatically attached to requests via interceptor.

### 4. Token Expiry Handling

When a 401 error occurs:
1. Clear stored tokens
2. Redirect to login page
3. Show "Session expired" message

## 📦 Data Flow Example

### Fetching Products

```
Component (ProductListPage)
    ↓
Context or Direct Call
    ↓
API Module (productApi.getAll)
    ↓
API Client (axios instance)
    ↓ [Interceptor adds token]
Backend API
    ↓
Response Data
    ↓ [Interceptor unwraps data]
Component Updates State
```

### Example Usage in Component

```javascript
import { useState, useEffect } from 'react';
import { productApi } from '../api';
import toast from 'react-hot-toast';

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getAll({
                limit: 12,
                sort: 'created_at',
                order: 'desc'
            });
            setProducts(response.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Render component...
}
```

## ⚠️ Error Handling

### Error Types

1. **Network Errors** - No internet connection
2. **Timeout Errors** - Request took too long
3. **Authentication Errors** (401) - Invalid or expired token
4. **Authorization Errors** (403) - Insufficient permissions
5. **Validation Errors** (400, 422) - Invalid input data
6. **Server Errors** (500) - Backend issues

### Error Response Format

```javascript
{
    success: false,
    message: "Error message here",
    errors: { // Only for validation errors
        field1: ["Error 1", "Error 2"],
        field2: ["Error message"]
    }
}
```

### Handling Errors in Components

```javascript
try {
    const result = await productApi.create(productData);
    toast.success('Product created successfully!');
} catch (error) {
    // Error is already formatted by interceptor
    toast.error(error.message);
}
```

## 🔄 State Management with Context

### Using Auth Context

```javascript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
    const { user, login, logout, isAuthenticated } = useAuth();

    const handleLogin = async () => {
        const result = await login(email, password);
        if (result.success) {
            // Redirect or show success
        } else {
            // Show error
            toast.error(result.message);
        }
    };

    return (
        <div>
            {isAuthenticated ? (
                <p>Welcome, {user.name}</p>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
}
```

## 📊 API Response Structure

### Success Response

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data
    }
}
```

### Paginated Response

```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 12,
        "total": 100,
        "totalPages": 9
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Error description",
    "errors": {
        // Field-specific errors (optional)
    }
}
```

## 🛠️ Development Tips

### 1. Testing API Calls

Use browser DevTools Network tab to inspect:
- Request URL
- Request headers (check Authorization header)
- Request payload
- Response status
- Response data

### 2. API Logging

In development mode, all API calls are logged to console:
```
[API Request] POST /auth/login
[API Response] POST /auth/login { success: true, ... }
[API Error] GET /products { status: 404, message: "Not found" }
```

### 3. Mock API Responses (for testing)

```javascript
// Create a mock API module for testing
const mockProductApi = {
    getAll: async () => ({
        data: [/* mock products */],
        pagination: { page: 1, total: 10 }
    })
};
```

## 🔧 Troubleshooting

### CORS Errors

**Problem**: `Access-Control-Allow-Origin` error

**Solution**: 
1. Ensure backend CORS is configured to allow your frontend domain
2. Check that credentials are sent correctly

### 401 Unauthorized

**Problem**: Getting 401 even with valid token

**Solution**:
1. Check token format: `Bearer <token>`
2. Verify token hasn't expired
3. Check backend authentication middleware

### Network Timeout

**Problem**: Requests timing out

**Solution**:
1. Check backend is running
2. Increase timeout in `client.js`
3. Check network connectivity

## 📚 Backend API Documentation

For complete backend API documentation, refer to:
- `olshop-backend/README.md`
- API endpoint definitions in `olshop-backend/src/routes/`

## 🔗 Related Files

- `src/api/client.js` - API client configuration
- `src/api/*.api.js` - API modules
- `src/context/*.js` - State management
- `src/hooks/use*.js` - Custom hooks

---

**Last Updated**: December 2025

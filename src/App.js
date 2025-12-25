import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { AppRoutes } from "./routes/AppRoutes"
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff'
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </WishlistProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>

  )
}
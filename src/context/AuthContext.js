import { createContext, useState, useEffect } from "react";
import { authApi, userApi } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        try {
            if (storedToken && storedUser && storedUser !== "undefined") {
                setToken(storedToken);
                if (storedRefreshToken) setRefreshToken(storedRefreshToken)
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.warn("Invalid stored user JSON, resetting...");
            localStorage.removeItem('user');
        }

        setLoading(false);
    }, []);


    const login = async (email, password) => {
        try {
            const data = await authApi.login(email, password);

            setToken(data.accessToken);
            setRefreshToken(data.refreshToken)
            setUser(data.user);

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, message: error.message?.data?.message || 'Login failed' };
        }
    }

    const register = async (userData) => {
        try {
            const data = await authApi.register(userData);
            setToken(data.accessToken);
            setUser(data.user);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message?.data?.message || 'Registration failed' };
        }
    }

    const logout = async () => {
        try {
            if (refreshToken) await authApi.logout(refreshToken);
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setToken(null);
            setRefreshToken(null);
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    const updateProfile = async (userData) => {
        try {
            const updatedUser = await userApi.updateProfile(userData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist update
            return { success: true, user: updatedUser };
        } catch (error) {
            return { success: false, message: error.message || 'Failed to update profile' };
        }
    }

    const changePassword = async (passwordData) => {
        try {
            await userApi.changePassword(passwordData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message || 'Failed to change password' };
        }
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!token,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('userInfo');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('userInfo', JSON.stringify(user));
        } else {
            localStorage.removeItem('userInfo');
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



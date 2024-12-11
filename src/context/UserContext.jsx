// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    // Initialize user state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Set complete user information
    const setUserInfo = useCallback((newUser) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    }, []);

    // Update specific user fields
    const updateUser = useCallback((updates) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    // Clear user data (for logout)
    const clearUser = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    const value = {
        user,
        setUserInfo,
        updateUser,
        clearUser,
        isAuthenticated: !!user
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// PropTypes for the UserProvider
UserProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
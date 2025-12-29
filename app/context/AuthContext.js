import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        } catch (error) {
            console.log('Login error', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password, displayName) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', { email, password, display_name: displayName });
            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        } catch (error) {
            console.log('Register error', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await SecureStore.getItemAsync('userToken');
            let userInfo = await SecureStore.getItemAsync('userInfo');

            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                setUserInfo(userInfo);
            }

            setUserToken(userToken);
        } catch (e) {
            console.log(`isLoggedIn error ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, register, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

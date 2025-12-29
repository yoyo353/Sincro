import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// CHANGE THIS TO YOUR LOCAL IP IF USING PHYSICAL DEVICE
// Android Emulator: 10.0.2.2
// iOS Simulator: localhost
const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

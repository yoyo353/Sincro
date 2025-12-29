import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CycleContext = createContext();

export const CycleProvider = ({ children }) => {
    const [cycles, setCycles] = useState([]);
    const [currentCycle, setCurrentCycle] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userToken } = useContext(AuthContext);

    const fetchCycles = async () => {
        if (!userToken) return;
        try {
            setLoading(true);
            const response = await api.get('/cycles');
            const data = response.data; // Ordered by start_date DESC
            setCycles(data);

            // Check if the most recent cycle is active (no end_date)
            if (data.length > 0 && !data[0].end_date) {
                setCurrentCycle(data[0]);
            } else {
                setCurrentCycle(null);
            }
        } catch (error) {
            console.error('Error fetching cycles:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPeriod = async (date) => {
        try {
            setLoading(true);
            const response = await api.post('/cycles/start', { start_date: date });
            await fetchCycles(); // Refresh
            return response.data;
        } catch (error) {
            console.error('Error starting period:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const endPeriod = async (date) => {
        try {
            setLoading(true);
            const response = await api.put('/cycles/end', { end_date: date });
            await fetchCycles(); // Refresh
            return response.data;
        } catch (error) {
            console.error('Error ending period:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userToken) {
            fetchCycles();
        }
    }, [userToken]);

    return (
        <CycleContext.Provider value={{ cycles, currentCycle, loading, startPeriod, endPeriod, fetchCycles }}>
            {children}
        </CycleContext.Provider>
    );
};

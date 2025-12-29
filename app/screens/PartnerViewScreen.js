import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const PartnerViewScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await api.get('/relationships/status');
            setStatus(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    // Determine Traffic Light Status based on cycle phase (mocked logic for now as endpoint data dependency)
    // Assuming backend returns phase/dates if permitted.
    // For now, let's look at the response structure from backend:
    // { status: 'ACTIVE', role: 'VIEWER', partner: {...}, permissions: {...} }
    // We need cycle data to determine the color.
    // Backend 'status' endpoint returns relationship info but maybe not cycle info?
    // I should probably update 'status' endpoint or call another endpoint for cycle data?
    // Spec says: "Si el permiso 'can_view_phase' es true, muestra el estado... basado en el ciclo".
    // I need to fetch the PARTNER'S cycle.
    // The 'cycle-routes' likely gets 'current user's cycle'.
    // I might need a specific endpoint to get Partner's cycle, OR 'status' endpoint should include it.
    // Let's assume for now I display what I have.

    // Mocking logic until I verify backend response for cycle data
    // Ideally I would call api.get('/cycles/partner') or similar.
    // For MVP/Phase 3 Step 1, I will show the connection status and placeholders.

    // Check permissions
    const canViewPhase = status?.permissions?.can_view_phase;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modo Espectador</Text>

            {status?.status === 'ACTIVE' ? (
                <Surface style={styles.card}>
                    <Text style={styles.partnerName}>Pareja: {status.partner?.display_name || 'Desconocido'}</Text>

                    {canViewPhase ? (
                        <View style={styles.trafficLight}>
                            {/* Placeholder for Traffic Light Logic */}
                            {/* Needs cycle data. For now, showing Permission Status */}
                            <View style={[styles.light, { backgroundColor: 'green' }]} />
                            <Text style={styles.statusText}>Fase: Visible</Text>
                        </View>
                    ) : (
                        <View style={styles.restricted}>
                            <Text>La pareja ha ocultado la fase del ciclo.</Text>
                        </View>
                    )}
                </Surface>
            ) : (
                <Text>No tienes una pareja activa.</Text>
            )}

            <Button mode="outlined" onPress={logout} style={styles.button}>
                Cerrar Sesión
            </Button>
            <Button mode="text" onPress={() => fetchStatus()}>
                Actualizar
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { padding: 20, elevation: 4, borderRadius: 10, width: '100%', alignItems: 'center' },
    partnerName: { fontSize: 18, marginBottom: 15 },
    trafficLight: { alignItems: 'center' },
    light: { width: 50, height: 50, borderRadius: 25, marginBottom: 10 },
    statusText: { fontSize: 16 },
    restricted: { padding: 10, backgroundColor: '#eee', borderRadius: 5 },
    button: { marginTop: 20 }
});

export default PartnerViewScreen;

import React, { useContext, useState } from 'react';
import { View, StyleSheet, Alert, TextInput as RNTextInput } from 'react-native';
import { Button, Text, Surface, TextInput, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const SetupScreen = ({ navigation }) => {
    const { logout, userInfo } = useContext(AuthContext);
    const [code, setCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [loading, setLoading] = useState(false);

    const generateCode = async () => {
        try {
            setLoading(true);
            const res = await api.post('/relationships/invite');
            setCode(res.data.code);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to generate code');
        }
    };

    const joinPartner = async () => {
        if (!inputCode) return;
        try {
            setLoading(true);
            await api.post('/relationships/join', { code: inputCode });
            setLoading(false);
            Alert.alert('Success', 'Paired successfully!', [
                { text: 'OK', onPress: () => navigation.replace('Home') }
            ]);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Failed to join');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configuración & Pareja</Text>

            <Surface style={styles.card}>
                <Text style={styles.subtitle}>Invitar Pareja</Text>
                <Text>Comparte este código con tu pareja:</Text>
                {loading ? <ActivityIndicator style={{ margin: 10 }} /> : (
                    <Text style={styles.code}>{code || '--- ---'}</Text>
                )}
                <Button mode="contained" onPress={generateCode} disabled={loading}>
                    Generar Código
                </Button>
            </Surface>

            <Surface style={styles.card}>
                <Text style={styles.subtitle}>Unirse a Pareja</Text>
                <TextInput
                    label="Ingresar Código"
                    value={inputCode}
                    onChangeText={setInputCode}
                    mode="outlined"
                    style={{ marginBottom: 10 }}
                    autoCapitalize="characters"
                />
                <Button mode="outlined" onPress={joinPartner} disabled={loading || !inputCode}>
                    Vincular
                </Button>
            </Surface>

            <Button mode="text" onPress={logout} style={styles.logout}>
                Cerrar Sesión
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { padding: 20, marginBottom: 20, elevation: 4, borderRadius: 10 },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    code: { fontSize: 32, letterSpacing: 5, textAlign: 'center', marginVertical: 15, fontWeight: 'bold' },
    logout: { marginTop: 20, alignSelf: 'center' }
});

export default SetupScreen;

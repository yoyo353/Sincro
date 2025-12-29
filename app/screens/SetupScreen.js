import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const SetupScreen = () => {
    const { logout, userInfo } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome {userInfo?.display_name || 'User'}!</Text>
            <Text style={styles.text}>This is the Setup/Onboarding Screen.</Text>

            <Button mode="contained" onPress={logout} style={styles.button}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
    },
});

export default SetupScreen;

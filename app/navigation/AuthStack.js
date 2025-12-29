import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SetupScreen from '../screens/SetupScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const AuthStack = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken === null ? (
                    // No token found, user isn't signed in
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    // User is signed in
                    <Stack.Screen name="Setup" component={SetupScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AuthStack;

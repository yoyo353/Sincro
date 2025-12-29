import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AuthStack />
      </AuthProvider>
    </PaperProvider>
  );
}

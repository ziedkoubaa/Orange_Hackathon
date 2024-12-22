// app/_layout.tsx
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Stack } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

const RootLayout = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <AuthStack />
      </PaperProvider>
    </AuthProvider>
  );
};

const AuthStack = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Display a loading indicator while authentication status is being determined
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <Stack>
      {user ? (
        // If the user is authenticated, navigate to the main app (tabs)
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // If not authenticated, show authentication screens via the (auth) group
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootLayout;

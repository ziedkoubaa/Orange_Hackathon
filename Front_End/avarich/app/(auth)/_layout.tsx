// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="SignInScreen" options={{ title: 'Sign In' }} />
      <Stack.Screen name="UserTypeScreen" options={{ title: 'Select User Type' }} />
    </Stack>
  );
}

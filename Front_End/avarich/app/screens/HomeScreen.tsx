// app/screens/HomeScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not logged in.</Text>
        <Button mode="contained" onPress={() => router.replace('/(auth)/SignInScreen')}>
          Sign In
        </Button>
      </View>
    );
  }

  const { email, userType, personalInformation } = user;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title>Welcome, {email}</Title>
      <Text style={styles.subtitle}>
        Your Role: {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : 'N/A'}
      </Text>

      {/* Personal Information Section */}
      {personalInformation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text>Name: {personalInformation.name || 'N/A'}</Text>
          <Text>Age: {personalInformation.age || 'N/A'}</Text>
          <Text>Occupation: {personalInformation.occupation || 'N/A'}</Text>
          <Text>
            Financial Dependents:{' '}
            {personalInformation.financialDependents !== undefined
              ? personalInformation.financialDependents
                ? 'Yes'
                : 'No'
              : 'N/A'}
          </Text>
          <Text>
            Primary Income Earner:{' '}
            {personalInformation.primaryIncomeEarner !== undefined
              ? personalInformation.primaryIncomeEarner
                ? 'Yes'
                : 'No'
              : 'N/A'}
          </Text>
        </View>
      )}

      {/* Add sections for other user information as needed */}

      <Button mode="outlined" onPress={signOut} style={styles.button}>
        Sign Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
});

export default HomeScreen;

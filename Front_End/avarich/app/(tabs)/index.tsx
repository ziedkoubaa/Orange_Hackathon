// app/screens/HomeScreen.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Avatar,
  Button,
  Title,
  Subheading,
  Text,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#409753" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Image
          source={require('@/assets/images/Avarich_LOGO.png')} // Replace with your image path
          style={[styles.logo, { width: 1000, height: 1000 }]}
          resizeMode="contain"
        />
        <Title style={styles.title}>Welcome to Our App</Title>
        <Subheading style={styles.subtitle}>Please sign in to continue</Subheading>
        <Button
          mode="contained"
          onPress={() => router.replace('/(auth)/SignInScreen')}
          style={styles.signInButton}
          theme={{ colors: { primary: '#409753' } }}
        >
          Sign In
        </Button>
      </View>
    );
  }

  const { email, userType, personalInformation } = user;

  // Function to get initials from the user's name or email
  const getInitials = () => {
    if (personalInformation?.name) {
      const names = personalInformation.name.trim().split(' ');
      const initials = names.map((n) => n[0]).join('');
      return initials.toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Logo on the Top Right */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Text
            size={64}
            label={getInitials()}
            style={styles.avatar}
            color="#fff"
          />
          <Title style={styles.title}>Welcome,</Title>
        </View>
        <Image
          source={require('@/assets/images/Avarich_LOGO.png')} // Replace with your image path
          style={[styles.logo, { width: 125, height: 125 }]}
          resizeMode="contain"
        />
      </View>

      <Subheading style={styles.subtitle}>{email}</Subheading>
      <Text style={styles.roleText}>
        Role: {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : 'N/A'}
      </Text>

      <Divider style={styles.divider} />

      {/* Personal Information Section */}
      {personalInformation && (
        <View style={styles.section}>
          <Subheading style={styles.sectionTitle}>Personal Information</Subheading>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{personalInformation.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{personalInformation.age || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Occupation:</Text>
            <Text style={styles.infoValue}>{personalInformation.occupation || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Financial Dependents:</Text>
            <Text style={styles.infoValue}>
              {personalInformation.financialDependents !== undefined
                ? personalInformation.financialDependents
                  ? 'Yes'
                  : 'No'
                : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary Income Earner:</Text>
            <Text style={styles.infoValue}>
              {personalInformation.primaryIncomeEarner !== undefined
                ? personalInformation.primaryIncomeEarner
                  ? 'Yes'
                  : 'No'
                : 'N/A'}
            </Text>
          </View>
        </View>
      )}

      {/* Add sections for other user information as needed */}

      <Button
        mode="outlined"
        onPress={signOut}
        style={styles.signOutButton}
        icon="logout"
        color="#409753"
        theme={{ colors: { primary: '#409753' } }}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#409753',
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#409753',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#777',
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#409753',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    flex: 1,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    flex: 2,
    color: '#555',
  },
  signOutButton: {
    marginTop: 10,
    borderColor: '#409753',
  },
  signInButton: {
    marginTop: 20,
    width: '60%',
    backgroundColor: '#409753',
  },
});

export default HomeScreen;

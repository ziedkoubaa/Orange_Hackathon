// app/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp(email, password);
      // Navigate to UserType selection screen
      router.replace('/(auth)/UserTypeScreen');
    } catch (err) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('@/assets/images/Avarich_LOGO.png')} // Replace with your image path
          style={styles.logo}
          resizeMode="contain"
        />
        <Title style={styles.title}>Create Account</Title>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#409753' } }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#409753' } }}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#409753' } }}
        />
        {error ? <HelperText type="error">{error}</HelperText> : null}
        <Button
          mode="contained"
          onPress={handleSignUp}
          loading={loading}
          disabled={loading}
          style={styles.button}
          theme={{ colors: { primary: '#409753' } }}
        >
          Sign Up
        </Button>
        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/SignInScreen')}>
            <Text style={styles.link}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#409753',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#409753',
  },
});

export default SignUpScreen;

// app/screens/SignInScreen.tsx

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

const SignInScreen: React.FC = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    if (!email || !password) {
      setError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation is handled by AuthProvider based on authentication status
      router.push('/(tabs)/ChatScreen');
    } catch (err) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('@/assets/images/Avarich_LOGO.png')} // Replace with your image path
          style={styles.logo}
          resizeMode="contain"
        />
        <Title style={styles.title}>Welcome Back</Title>
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
        {error ? <HelperText type="error">{error}</HelperText> : null}
        <Button
          mode="contained"
          onPress={handleSignIn}
          loading={loading}
          disabled={loading}
          style={styles.button}
          theme={{ colors: { primary: '#409753' } }}
        >
          Sign In
        </Button>
        <View style={styles.footer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/SignUpScreen')}>
            <Text style={styles.link}> Sign Up</Text>
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

export default SignInScreen;

// app/screens/UserTypeScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button, Title, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const UserTypeScreen: React.FC = () => {
  const router = useRouter();
  const { assignUserType } = useAuth();
  const [userType, setUserType] = useState<string>('student');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelect = async () => {
    setLoading(true);
    try {
      await assignUserType(userType);
      Alert.alert('Success', 'User type selected successfully.');
      router.replace('/screens/PersonalInformationScreen'); // Navigate to the first form screen
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Select Your User Type</Title>
      <RadioButton.Group onValueChange={setUserType} value={userType}>
        <View style={styles.radioRow}>
          <RadioButton value="student" />
          <Text style={styles.radioLabel}>Student</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="entrepreneur" />
          <Text style={styles.radioLabel}>Entrepreneur</Text>
        </View>
      </RadioButton.Group>
      <Button
        mode="contained"
        onPress={handleSelect}
        loading={loading}
        disabled={loading}
        style={styles.button}
        buttonColor="#409753"
      >
        Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
});

export default UserTypeScreen;

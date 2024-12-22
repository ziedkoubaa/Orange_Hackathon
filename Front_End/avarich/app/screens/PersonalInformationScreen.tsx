// app/screens/PersonalInformationScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, RadioButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { updatePersonalInformation } from '../api/auth';

const PersonalInformationScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [financialDependents, setFinancialDependents] = useState<string>('No');
  const [primaryIncomeEarner, setPrimaryIncomeEarner] = useState<string>('No');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!user || !user.token) return;

    setLoading(true);
    try {
      const personalInfo = {
        name,
        age: age ? parseInt(age) : undefined,
        occupation,
        financialDependents: financialDependents === 'Yes',
        primaryIncomeEarner: primaryIncomeEarner === 'Yes',
      };
      await updatePersonalInformation(user.token, personalInfo);
      Alert.alert('Success', 'Personal Information updated successfully.');
      // Navigate to the next screen (e.g., IncomeScreen)
      router.replace('/(auth)/SignInScreen');
    } catch (error: any) {
      console.error('Personal Information Update Error:', error);
      Alert.alert('Error', 'Failed to update Personal Information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Personal Information</Title>
      <TextInput
        label="Name (optional)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.question}>Do you have any financial dependents?</Text>
      <RadioButton.Group
        onValueChange={setFinancialDependents}
        value={financialDependents}
      >
        <View style={styles.radioRow}>
          <RadioButton value="Yes" />
          <Text>Yes</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="No" />
          <Text>No</Text>
        </View>
      </RadioButton.Group>

      <Text style={styles.question}>
        Are you currently the primary income earner in your household?
      </Text>
      <RadioButton.Group
        onValueChange={setPrimaryIncomeEarner}
        value={primaryIncomeEarner}
      >
        <View style={styles.radioRow}>
          <RadioButton value="Yes" />
          <Text>Yes</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="No" />
          <Text>No</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        buttonColor="#409753"
        style={styles.button}
      >
        Next
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  button: {
    marginTop: 30,
    
  },
});

export default PersonalInformationScreen;

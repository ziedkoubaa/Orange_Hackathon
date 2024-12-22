// app/(tabs)/_layout.tsx

import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider, LanguageContext } from '../contexts/LanguageContext';
import { AvatarProvider, AvatarContext } from '../contexts/AvatarContext';

const TabsLayout = () => {
  return (
    <LanguageProvider>
      <AvatarProvider>
        <TabsScreens />
      </AvatarProvider>
    </LanguageProvider>
  );
};

const TabsScreens = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { avatar, toggleAvatar } = useContext(AvatarContext);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={'#409753'} />
          ),
          headerStyle: {
            backgroundColor: '#409753',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          // Dynamic title based on selected avatar
          title: avatar === 'male' ? 'Avatar Male' : 'Avatar Female',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={'#409753'} />
          ),
          headerRight: () => (
            <View style={styles.switchContainer}>
              <Switch
                value={avatar === 'male'}
                onValueChange={toggleAvatar}
                color="#fff"
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#409753',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tabs.Screen
        name="ChatScreen"
        options={{
          title: language === 'ENG' ? 'Chat ENG' : 'Chat ARBAE',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={'#409753'} />
          ),
          headerRight: () => (
            <View style={styles.switchContainer}>
              <Switch
                value={language === 'TUN'}
                onValueChange={toggleLanguage}
                color="#fff"
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: '#409753',
          },
          headerTintColor: '#fff',
        }}
      />
      {/* Add more tabs as needed */}
    </Tabs>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    marginRight: 10,
  },
});

export default TabsLayout;

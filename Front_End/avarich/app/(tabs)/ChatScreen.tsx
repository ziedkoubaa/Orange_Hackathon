// app/screens/ChatScreen.tsx

import React, { useState, useContext } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LanguageContext } from '../contexts/LanguageContext'; // Import LanguageContext

// Define the Message type for type safety
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

// API keys for different languages
const ENG_API_KEY = 'AIzaSyB1FT-qopMUfNlFNvWBfGLXkFvs93U6Flw';
const TUN_API_KEY = 'AIzaSyBLCBUa_KIA9k_1GU2B_3aDz6cGDECmOfI';

const ChatScreen: React.FC = () => {
  const { language } = useContext(LanguageContext); // Access the current language
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [userMessage, ...prev]);
    setInput('');

    setLoading(true);

    try {
      // Determine API key based on language
      const apiKey = language === 'ENG' ? ENG_API_KEY : TUN_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey); // Initialize with selected API key

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(input);

      let botResponse = 'Sorry, I could not understand that.';
      if (result.response) {
        const text = await result.response.text();
        botResponse = text || botResponse;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
      };
      setMessages((prev) => [botMessage, ...prev]);
    } catch (error: any) {
      console.error('Error fetching response:', error);
      Alert.alert('Error', 'Could not fetch response from the server.');

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Error: Could not get response.',
        sender: 'bot',
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.user : styles.bot,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.botText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />
      {loading && (
        <ActivityIndicator
          size="small"
          color="#409753"
          style={styles.loading}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          editable={!loading}
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          disabled={loading || input.trim() === ''}
          style={styles.sendButton}
          contentStyle={styles.sendButtonContent}
          theme={{ colors: { primary: '#409753' } }}
        >
          Send
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#409753',
    borderTopRightRadius: 0,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#409753',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    borderRadius: 25,
    justifyContent: 'center',
  },
  sendButtonContent: {
    height: 40,
    paddingHorizontal: 20,
  },
  loading: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
});

export default ChatScreen;

// app/screens/MediaScreen.tsx

import React, { useRef, useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AvatarContext } from '../contexts/AvatarContext';

const MediaScreen: React.FC = () => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Start with true to play by default

  const { avatar } = useContext(AvatarContext);

  const handleMicrophonePress = () => {
    // Add your microphone functionality here
    Alert.alert('Microphone Pressed', 'Implement your microphone functionality.');
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (typeof status.isPlaying === 'boolean') {
        setIsPlaying(status.isPlaying);
      }
    } else if (status.error) {
      Alert.alert('Video Error', status.error);
    }
  };

  // Choose the video source based on the selected avatar
  const videoSource =
    avatar === 'male'
      ? require('../../videos/boy_Avatar.mp4') // Path to male avatar video
      : require('../../videos/girl_Avatar.mp4'); // Path to female avatar video

  // Automatically play the video when the component mounts or when the video source changes
  useEffect(() => {
    const loadAndPlayVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.unloadAsync(); // Unload any previous video
          await videoRef.current.loadAsync(
            videoSource,
            { shouldPlay: true, isLooping: true },
            true
          ); // Load and play the new video
          setIsPlaying(true);
        } catch (error) {
          console.error('Error loading or playing video:', error);
          Alert.alert('Video Error', 'Could not load or play the video.');
        }
      }
    };

    loadAndPlayVideo();
  }, [videoSource]);

  return (
    <View style={styles.container}>
      {/* Video Section */}
      <Video
        ref={videoRef}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      {/* Footer with Microphone Icon */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleMicrophonePress}
          accessible
          accessibilityLabel="Microphone Button"
        >
          <MaterialCommunityIcons name="microphone" size={40} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  video: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000', // Black background for the video area
  },
  footer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#256d3f', // Darker green for the icon button background
    borderRadius: 50,
  },
});

export default MediaScreen;

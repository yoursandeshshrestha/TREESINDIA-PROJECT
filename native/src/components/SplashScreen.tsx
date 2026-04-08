import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  const opacity = useSharedValue(0);
  const video = useRef<Video>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Fade in
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease,
    });
  }, [opacity]);

  useEffect(() => {
    // When video ends, wait a bit then call onFinish
    if (videoEnded && onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [videoEnded, onFinish]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      setVideoEnded(true);
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View className="flex-1 items-center justify-center bg-white" style={containerStyle}>
      <Video
        ref={video}
        source={require('../../assets/app-motion.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});

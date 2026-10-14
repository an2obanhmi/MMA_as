import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, BrutalShadow } from '../styles/theme';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastConfig {
  message: string;
  type: ToastType;
}

interface ToastBannerProps {
  toast: ToastConfig | null;
  onDismiss: () => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toast, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hide();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  const bgColor = isSuccess
    ? Colors.accentElectric
    : isError
    ? '#FFEBE6'
    : Colors.surface;

  const iconName = isSuccess
    ? 'checkmark-circle-outline'
    : isError
    ? 'alert-circle-outline'
    : 'information-circle-outline';

  const iconColor = isSuccess
    ? Colors.text
    : isError
    ? Colors.accentOrange
    : Colors.accentBlue;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: isError ? Colors.accentOrange : Colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Ionicons name={iconName} size={22} color={iconColor} />
      <Text style={[styles.text, isError && styles.textError]}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    gap: 10,
    left: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    position: 'absolute',
    right: Spacing.md,
    top: 50,
    zIndex: 9999,
    ...BrutalShadow,
  },
  text: {
    color: Colors.text,
    flex: 1,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  textError: {
    color: Colors.accentOrange,
  },
});

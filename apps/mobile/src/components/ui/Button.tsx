import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, RADIUS, FONTS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : '#fff'}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`textSize_${size}`],
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    gap: 8,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  ghost: { backgroundColor: 'transparent' },

  size_sm: { paddingVertical: 8, paddingHorizontal: 16 },
  size_md: { paddingVertical: 14, paddingHorizontal: 24 },
  size_lg: { paddingVertical: 18, paddingHorizontal: 32 },

  text: { fontWeight: '600' },
  text_primary: { color: '#fff' },
  text_secondary: { color: '#fff' },
  text_outline: { color: COLORS.primary },
  text_ghost: { color: COLORS.primary },

  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 17 },
});

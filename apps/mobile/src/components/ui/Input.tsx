import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, leftIcon, containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithIcon : undefined, style]}
          placeholderTextColor={COLORS.textLight}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.error },
  iconWrapper: { paddingLeft: 14 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  inputWithIcon: { paddingLeft: 8 },
  error: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
});

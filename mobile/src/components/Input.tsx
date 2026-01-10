import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    style,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputWrapper,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={colors.neutrals.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity style={styles.iconRight} onPress={onRightIconPress}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
            {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surfaceAlt,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
    },
    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.neutrals.background,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputError: {
        borderColor: colors.error,
        backgroundColor: '#FFF5F5',
    },
    input: {
        flex: 1,
        height: 52,
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
    },
    iconLeft: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginLeft: spacing.sm,
    },
    errorText: {
        fontSize: typography.fontSize.xs,
        color: colors.error,
        marginTop: spacing.xs,
        fontWeight: typography.fontWeight.medium,
    },
    helperText: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        marginTop: spacing.xs,
    },
});

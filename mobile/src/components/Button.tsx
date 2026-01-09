import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    fullWidth = false,
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[`button_${variant}`],
                styles[`button_${size}`],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? colors.neutrals.background : colors.primary} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        styles[`text_${variant}`],
                        styles[`text_${size}`],
                        isDisabled && styles.textDisabled,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
    },
    button_primary: {
        backgroundColor: colors.primary,
        ...Platform.select({
            web: {
                transition: 'all 0.2s ease',
            } as any,
            default: {},
        }),
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    button_secondary: {
        backgroundColor: colors.secondary,
    },
    button_outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.neutrals.border,
    },
    button_ghost: {
        backgroundColor: 'transparent',
    },
    button_sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    button_md: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    button_lg: {
        paddingVertical: spacing.lg - 4,
        paddingHorizontal: spacing['2xl'],
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: 0.3,
    },
    text_primary: {
        color: colors.neutrals.background,
    },
    text_secondary: {
        color: colors.neutrals.background,
    },
    text_outline: {
        color: colors.neutrals.textPrimary,
    },
    text_ghost: {
        color: colors.primary,
    },
    text_sm: {
        fontSize: typography.fontSize.sm,
    },
    text_md: {
        fontSize: typography.fontSize.base,
    },
    text_lg: {
        fontSize: typography.fontSize.lg,
    },
    textDisabled: {
        opacity: 0.7,
    },
});

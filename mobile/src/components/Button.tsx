import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Platform, View } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/theme';
import { Text } from './Text';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

import { StyleProp } from 'react-native';

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
    leftIcon,
    rightIcon,
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed, hovered, focused }: any) => [
                styles.button,
                styles[`button_${variant}`],
                styles[`button_${size}`],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                hovered && Platform.OS === 'web' && styles[`button_${variant}_hover`],
                pressed && styles.pressed,
                focused && Platform.OS === 'web' && styles.focused,
                style as any,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? colors.neutrals.surface : colors.primary} size="small" />
            ) : (
                <View style={styles.contentRow}>
                    {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                    <Text
                        variant={size === 'lg' ? 'bodyLarge' : size === 'sm' ? 'bodySmall' : 'body'}
                        weight="bold"
                        style={[
                            styles.text,
                            styles[`text_${variant}`],
                            isDisabled && styles.textDisabled,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                    {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1.5,
        borderColor: 'transparent',
        ...Platform.select({
            web: {
                cursor: 'pointer',
                transitionProperty: 'all',
                transitionDuration: '200ms',
                outlineStyle: 'none',
            } as any,
        }),
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    button_primary_hover: {
        backgroundColor: colors.primaryDark,
        borderColor: colors.primaryDark,
    },
    button_secondary: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    button_secondary_hover: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    button_outline: {
        backgroundColor: 'transparent',
        borderColor: colors.neutrals.border,
    },
    button_outline_hover: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft + '40',
    },
    button_ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    button_ghost_hover: {
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    button_sm: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        height: 36,
    },
    button_md: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        height: 48,
    },
    button_lg: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing['2xl'],
        height: 56,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
        ...Platform.select({
            web: { cursor: 'not-allowed' } as any,
        }),
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    focused: {
        ...Platform.select({
            web: {
                boxShadow: `0 0 0 3px ${colors.focusRing}`,
            } as any,
        }),
    },
    text: {
        textAlign: 'center',
    },
    text_primary: {
        color: colors.neutrals.surface,
    },
    text_secondary: {
        color: colors.neutrals.surface,
    },
    text_outline: {
        color: colors.neutrals.textPrimary,
    },
    text_ghost: {
        color: colors.primary,
    },
    textDisabled: {
        opacity: 0.8,
    },
    iconLeft: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginLeft: spacing.sm,
    },
});

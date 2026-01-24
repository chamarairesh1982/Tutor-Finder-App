import React from 'react';
import { View, ViewStyle, StyleSheet, Platform, Pressable, StyleProp } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../lib/theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'subtle';
    padding?: keyof typeof spacing;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export function Card({
    children,
    variant = 'elevated',
    padding = 'md',
    onPress,
    style
}: CardProps) {

    const cardStyles: StyleProp<ViewStyle> = [
        styles.base,
        styles[variant],
        { padding: spacing[padding] },
        style,
    ];

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [cardStyles, pressed && styles.pressed]}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View style={cardStyles}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.lg,
        backgroundColor: colors.neutrals.surface,
        ...Platform.select({
            web: {
                transitionProperty: 'all',
                transitionDuration: '200ms',
            } as any,
        }),
    },
    pressed: {
        opacity: 0.95,
        transform: [{ scale: 0.99 }],
    },
    elevated: {
        ...shadows.subtle,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    filled: {
        backgroundColor: colors.neutrals.surfaceAlt,
        borderWidth: 0,
    },
    subtle: {
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        ...shadows.glass,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(10px)',
            } as any,
        }),
    }
});

import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { colors, borderRadius, spacing } from '../lib/theme';

interface IconButtonProps {
    icon: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost' | 'glass';
    size?: number;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function IconButton({
    icon,
    onPress,
    variant = 'ghost',
    size = 44,
    disabled = false,
    style
}: IconButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed, hovered }: any) => [
                styles.base,
                styles[variant],
                { width: size, height: size, borderRadius: size / 2 },
                hovered && Platform.OS === 'web' && styles[`${variant}_hover`],
                pressed && styles.pressed,
                style as any
            ]}
        >
            {icon}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: {
                transitionProperty: 'all',
                transitionDuration: '200ms',
                outlineStyle: 'none',
            } as any,
        }),
    },
    primary: {
        backgroundColor: colors.primary,
    },
    primary_hover: {
        backgroundColor: colors.primaryDark,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.neutrals.border,
    },
    outline_hover: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft + '40',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    ghost_hover: {
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    glass_hover: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.96 }],
    },
});

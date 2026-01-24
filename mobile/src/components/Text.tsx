import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors, typography } from '../lib/theme';

export type TextVariant =
    | 'h1' | 'h2' | 'h3' | 'h4'
    | 'bodyLarge' | 'body' | 'bodySmall'
    | 'caption' | 'label';

export type TextWeight = keyof typeof typography.fontWeight;

interface TextProps extends RNTextProps {
    variant?: TextVariant;
    weight?: TextWeight;
    color?: string;
    align?: TextStyle['textAlign'];
}

export function Text({
    children,
    style,
    variant = 'body',
    weight,
    color,
    align,
    ...props
}: TextProps) {

    const textStyles: StyleProp<TextStyle> = [
        styles.base,
        styles[variant],
        weight && { fontWeight: typography.fontWeight[weight] },
        color && { color },
        align && { textAlign: align },
        style,
    ];

    return (
        <RNText style={textStyles} {...props}>
            {children}
        </RNText>
    );
}

const styles = StyleSheet.create({
    base: {
        fontFamily: typography.fontFamily.sans,
        color: colors.neutrals.textPrimary,
    },
    h1: {
        fontSize: typography.fontSize['4xl'],
        lineHeight: typography.fontSize['4xl'] * 1.1,
        fontWeight: typography.fontWeight.heavy,
    },
    h2: {
        fontSize: typography.fontSize['3xl'],
        lineHeight: typography.fontSize['3xl'] * 1.2,
        fontWeight: typography.fontWeight.bold,
    },
    h3: {
        fontSize: typography.fontSize['2xl'],
        lineHeight: typography.fontSize['2xl'] * 1.2,
        fontWeight: typography.fontWeight.bold,
    },
    h4: {
        fontSize: typography.fontSize.xl,
        lineHeight: typography.fontSize.xl * 1.3,
        fontWeight: typography.fontWeight.semibold,
    },
    bodyLarge: {
        fontSize: typography.fontSize.lg,
        lineHeight: typography.fontSize.lg * 1.5,
    },
    body: {
        fontSize: typography.fontSize.base,
        lineHeight: typography.fontSize.base * 1.5,
    },
    bodySmall: {
        fontSize: typography.fontSize.sm,
        lineHeight: typography.fontSize.sm * 1.5,
    },
    caption: {
        fontSize: typography.fontSize.xs,
        lineHeight: typography.fontSize.xs * 1.4,
        color: colors.neutrals.textMuted,
    },
    label: {
        fontSize: 11,
        lineHeight: 14,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: colors.neutrals.textMuted,
    },
});

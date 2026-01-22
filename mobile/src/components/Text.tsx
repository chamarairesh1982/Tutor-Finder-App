import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors, typography } from '../lib/theme';

export type TextVariant =
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'bodyLarge' | 'body' | 'bodySmall'
    | 'caption';

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
        lineHeight: typography.lineHeight.tight,
        fontWeight: typography.fontWeight.bold,
        marginBottom: 8,
    },
    h2: {
        fontSize: typography.fontSize['3xl'],
        lineHeight: typography.lineHeight.tight,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 6,
    },
    h3: {
        fontSize: typography.fontSize['2xl'],
        lineHeight: typography.lineHeight.tight,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 4,
    },
    h4: {
        fontSize: typography.fontSize.xl,
        lineHeight: typography.lineHeight.normal,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 4,
    },
    h5: {
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.normal,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 2,
    },
    h6: {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.normal,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: 2,
    },
    bodyLarge: {
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.relaxed,
        fontWeight: typography.fontWeight.normal,
    },
    body: {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.relaxed,
        fontWeight: typography.fontWeight.normal,
    },
    bodySmall: {
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.normal,
        fontWeight: typography.fontWeight.normal,
    },
    caption: {
        fontSize: typography.fontSize.xs,
        lineHeight: typography.lineHeight.normal,
        color: colors.neutrals.textMuted,
    },
});

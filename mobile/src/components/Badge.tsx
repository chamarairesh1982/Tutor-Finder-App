import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../lib/theme';
import { Text } from './Text';

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'dbs' | 'certified';
    size?: 'sm' | 'md';
    style?: StyleProp<ViewStyle>;
}

export function Badge({
    label,
    variant = 'neutral',
    size = 'md',
    style
}: BadgeProps) {
    return (
        <View style={[styles.badge, styles[variant], styles[size], style]}>
            <Text
                variant="label"
                style={[styles.text, styles[`text_${variant}`], size === 'sm' && { fontSize: 9 }]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sm: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    md: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    primary: { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 1 },
    secondary: { backgroundColor: colors.secondary + '20', borderColor: colors.secondary, borderWidth: 1 },
    success: { backgroundColor: colors.successLight, borderColor: colors.success + '40', borderWidth: 1 },
    warning: { backgroundColor: colors.warningLight, borderColor: colors.warning + '40', borderWidth: 1 },
    error: { backgroundColor: colors.errorLight, borderColor: colors.error + '40', borderWidth: 1 },
    neutral: { backgroundColor: colors.neutrals.surfaceAlt, borderColor: colors.neutrals.border, borderWidth: 1 },
    dbs: { backgroundColor: colors.trust.dbsLight, borderColor: colors.trust.dbs + '40', borderWidth: 1 },
    certified: { backgroundColor: colors.trust.certifiedLight, borderColor: colors.trust.certified + '40', borderWidth: 1 },

    text: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    text_primary: { color: colors.primaryDark },
    text_secondary: { color: colors.secondary },
    text_success: { color: colors.success },
    text_warning: { color: colors.warning },
    text_error: { color: colors.error },
    text_neutral: { color: colors.neutrals.textMuted },
    text_dbs: { color: colors.trust.dbs },
    text_certified: { color: colors.trust.certified },
});

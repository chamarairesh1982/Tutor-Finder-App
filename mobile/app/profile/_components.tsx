import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';

interface SimpleScreenProps {
    title: string;
    subtitle: string;
    body: string;
}

export function SimpleInfoScreen({ title, subtitle, body }: SimpleScreenProps) {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
        padding: spacing.lg,
    },
    card: {
        backgroundColor: colors.neutrals.background,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
        gap: spacing.sm,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
    },
    body: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
});

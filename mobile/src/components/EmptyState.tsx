import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { spacing, colors } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
    title = "No results found",
    message = "Try adjusting your filters or search terms.",
    actionLabel,
    onAction,
    icon = "search-outline"
}: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color={colors.primary} />
            </View>
            <Text variant="h4" align="center" style={styles.title}>{title}</Text>
            <Text variant="body" align="center" style={styles.message}>{message}</Text>
            {onAction && actionLabel && (
                <Button title={actionLabel} onPress={onAction} variant="secondary" style={styles.button} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        marginBottom: spacing.sm,
    },
    message: {
        color: colors.neutrals.textSecondary,
        marginBottom: spacing.lg,
        maxWidth: 280,
    },
    button: {
        minWidth: 150,
    }
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { spacing, colors } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

export function ErrorState({
    title = "Something went wrong",
    message = "We couldn't load the data. Please check your connection and try again.",
    onRetry,
    icon = "alert-circle-outline"
}: ErrorStateProps) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={48} color={colors.error} style={styles.icon} />
            <Text variant="h4" align="center" style={styles.title}>{title}</Text>
            <Text variant="body" align="center" style={styles.message}>{message}</Text>
            {onRetry && (
                <Button title="Try Again" onPress={onRetry} variant="primary" style={styles.button} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: spacing.md,
    },
    title: {
        marginBottom: spacing.sm,
    },
    message: {
        marginBottom: spacing.lg,
        maxWidth: 300,
    },
    button: {
        minWidth: 150,
    }
});

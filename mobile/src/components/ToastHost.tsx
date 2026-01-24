import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationStore } from '../store/notificationStore';
import { colors, spacing, borderRadius, typography, shadows } from '../lib/theme';

export function ToastHost() {
    const insets = useSafeAreaInsets();
    const { toasts, removeToast } = useNotificationStore();

    if (!toasts.length) return null;

    return (
        <View pointerEvents="box-none" style={[styles.container, { top: Math.max(insets.top, spacing.md) }]}> 
            {toasts.map((toast) => {
                const tone = getTone(toast.type);
                return (
                    <TouchableOpacity
                        key={toast.id}
                        activeOpacity={0.9}
                        onPress={() => removeToast(toast.id)}
                        style={[styles.toast, { borderLeftColor: tone.accent }]}
                    >
                        <Text style={styles.title}>{toast.title}</Text>
                        {!!toast.message && <Text style={styles.message}>{toast.message}</Text>}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function getTone(type: 'success' | 'error' | 'info') {
    switch (type) {
        case 'success':
            return { accent: colors.success };
        case 'error':
            return { accent: colors.error };
        default:
            return { accent: colors.primary };
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        zIndex: 1000,
        gap: spacing.sm,
    },
    toast: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        borderLeftWidth: 5,
        ...shadows.md,
    },
    title: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    message: {
        marginTop: 2,
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        lineHeight: 16,
    },
});

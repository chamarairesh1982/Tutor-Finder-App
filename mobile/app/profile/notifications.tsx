import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../../src/lib/theme';

export default function NotificationsScreen() {
    const router = useRouter();
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(false);
    const [marketingEnabled, setMarketingEnabled] = useState(true);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Email Notifications</Text>
                        <Text style={styles.description}>Receive booking updates and receipts via email</Text>
                    </View>
                    <Switch
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                        trackColor={{ true: colors.primary }}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Push Notifications</Text>
                        <Text style={styles.description}>Receive immediate alerts on your device</Text>
                    </View>
                    <Switch
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                        trackColor={{ true: colors.primary }}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Marketing</Text>
                        <Text style={styles.description}>Receive news, discounts and updates</Text>
                    </View>
                    <Switch
                        value={marketingEnabled}
                        onValueChange={setMarketingEnabled}
                        trackColor={{ true: colors.primary }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
        gap: spacing.md,
    },
    backButton: {
        fontSize: typography.fontSize.base,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    content: {
        padding: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.surfaceAlt,
    },
    textContainer: {
        flex: 1,
        paddingRight: spacing.md,
    },
    label: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: 2,
    },
    description: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
});

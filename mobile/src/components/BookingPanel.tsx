import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { TeachingMode } from '../types';
import { Input } from './Input';
import { Button } from './Button';

interface BookingPanelProps {
    pricePerHour: number;
    mode: TeachingMode;
    onModeChange: (mode: TeachingMode) => void;
    preferredDate?: string;
    onPreferredDateChange: (value: string) => void;
    message: string;
    onMessageChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    responseTimeText?: string;
}

const modeLabels = [
    { value: TeachingMode.InPerson, label: 'In-person' },
    { value: TeachingMode.Online, label: 'Online' },
    { value: TeachingMode.Both, label: 'Flexible' },
];

export function BookingPanel({
    pricePerHour,
    mode,
    onModeChange,
    preferredDate,
    onPreferredDateChange,
    message,
    onMessageChange,
    onSubmit,
    isSubmitting,
    responseTimeText,
}: BookingPanelProps) {
    const handleLinkPress = (url: string) => {
        Linking.openURL(url).catch(() => {});
    };

    return (
        <View style={styles.container}>
            <View style={styles.priceRow}>
                <View>
                    <Text style={styles.price}>£{pricePerHour}</Text>
                    <Text style={styles.priceCaption}>per hour</Text>
                </View>
                <View style={styles.tag}><Text style={styles.tagText}>Secure booking</Text></View>
            </View>

            <Text style={styles.sectionLabel}>Mode</Text>
            <View style={styles.modeRow}>
                {modeLabels.map((item) => {
                    const isActive = item.value === mode;
                    return (
                        <TouchableOpacity
                            key={item.value}
                            style={[styles.modeButton, isActive && styles.modeButtonActive]}
                            onPress={() => onModeChange(item.value)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.modeText, isActive && styles.modeTextActive]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Input
                label="Date/time preference"
                placeholder="e.g. Saturdays 10–12 or evenings"
                value={preferredDate ?? ''}
                onChangeText={onPreferredDateChange}
            />

            <Input
                label="Message"
                placeholder="Introduce yourself and your goals"
                value={message}
                onChangeText={onMessageChange}
                multiline
                numberOfLines={4}
                style={styles.messageInput}
            />

            <Button title="Send booking request" onPress={onSubmit} isLoading={isSubmitting} fullWidth size="lg" />
            <View style={styles.helperSection}>
                <Text style={styles.helper}>
                    {responseTimeText ?? 'Most tutors reply within 24 hours. We keep your details safe.'}
                </Text>
                <View style={styles.helperLinks}>
                    <TouchableOpacity onPress={() => handleLinkPress('https://www.tutorfinder.uk/safety')} activeOpacity={0.8}>
                        <Text style={styles.helperLink}>Safety tips</Text>
                    </TouchableOpacity>
                    <Text style={styles.helperSeparator}>•</Text>
                    <TouchableOpacity onPress={() => handleLinkPress('https://www.tutorfinder.uk/help/secure-payments')} activeOpacity={0.8}>
                        <Text style={styles.helperLink}>Secure payments</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
        gap: spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    priceCaption: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    tag: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    tagText: {
        color: colors.primaryDark,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
    },
    sectionLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    modeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    modeButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    modeButtonActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    modeText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    modeTextActive: {
        color: colors.primaryDark,
    },
    messageInput: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: spacing.sm,
    },
    helperSection: {
        gap: spacing.xs,
    },
    helper: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
    },
    helperLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        flexWrap: 'wrap',
    },
    helperLink: {
        fontSize: typography.fontSize.xs,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    helperSeparator: {
        color: colors.neutrals.textMuted,
        fontSize: typography.fontSize.xs,
    },
});

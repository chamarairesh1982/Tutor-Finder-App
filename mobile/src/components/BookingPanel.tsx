import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
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
    ctaTitle?: string;
    ctaDisabled?: boolean;
    onCtaPress?: () => void;
    availabilitySlots?: any[];
    onSelectFromSchedule?: () => void;
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
    ctaTitle,
    ctaDisabled,
    onCtaPress,
    availabilitySlots,
    onSelectFromSchedule,
}: BookingPanelProps) {
    const handleLinkPress = (url: string) => {
        Linking.openURL(url).catch(() => { });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <View style={styles.priceRow}>
                        <Text style={styles.currency}>£</Text>
                        <Text style={styles.price}>{pricePerHour}</Text>
                        <Text style={styles.perHour}>/hr</Text>
                    </View>
                    <Text style={styles.priceSub}>Session price</Text>
                </View>
                <View style={styles.secureTag}>
                    <Text style={styles.secureIcon}>🔒</Text>
                    <Text style={styles.secureText}>Secure</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.formGroup}>
                <Text style={styles.label}>Teaching Mode</Text>
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
            </View>

            <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>When would you like to meet?</Text>
                    {availabilitySlots && availabilitySlots.length > 0 && (
                        <TouchableOpacity onPress={onSelectFromSchedule}>
                            <Text style={styles.scheduleLink}>Pick from schedule</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Input
                    placeholder="e.g. Tuesday at 18:00"
                    value={preferredDate ?? ''}
                    onChangeText={onPreferredDateChange}
                    style={styles.dateInput}
                />
            </View>

            <Input
                label="Message to tutor"
                placeholder="Hi, I'm looking for help with..."
                value={message}
                onChangeText={onMessageChange}
                multiline
                numberOfLines={4}
                style={styles.messageInput}
            />

            <Button
                title={ctaTitle ?? "Request Booking"}
                onPress={onCtaPress ?? onSubmit}
                isLoading={isSubmitting}
                fullWidth
                size="lg"
                disabled={!!ctaDisabled}
            />

            <View style={styles.footer}>
                <Text style={styles.responseTime}>
                    <Text style={styles.responseIcon}>⚡ </Text>
                    {responseTimeText || 'Typically responds within a few hours'}
                </Text>
                <Text style={styles.guarantee}>
                    Free cancellation before the first lesson.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.md,
        gap: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currency: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginRight: 2,
    },
    price: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -1,
    },
    perHour: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        marginLeft: 2,
    },
    priceSub: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        marginTop: -4,
    },
    secureTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: spacing.sm,
        backgroundColor: 'rgba(217, 70, 239, 0.1)',
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(217, 70, 239, 0.2)',
    },
    secureIcon: {
        fontSize: 10,
    },
    secureText: {
        fontSize: 11,
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.cardBorder,
        opacity: 0.5,
    },
    formGroup: {
        marginBottom: spacing.md,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    scheduleLink: {
        fontSize: typography.fontSize.xs,
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    dateInput: {
        marginTop: 0,
    },
    modeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    modeButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
        ...Platform.select({ web: { cursor: 'pointer' } }),
    },
    modeButtonActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    modeText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    modeTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: spacing.sm,
    },
    footer: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    responseTime: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    responseIcon: {
        fontSize: 12,
    },
    guarantee: {
        fontSize: 11,
        color: colors.neutrals.textMuted,
        textAlign: 'center',
    },
});

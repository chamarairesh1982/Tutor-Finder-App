import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../lib/theme';
import { TeachingMode } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

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
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <View style={styles.priceRow}>
                        <Text variant="h2" weight="heavy">£{pricePerHour}</Text>
                        <Text variant="bodySmall" color={colors.neutrals.textMuted} style={{ marginLeft: 4 }}>/ hour</Text>
                    </View>
                    <Text variant="caption">Total per session</Text>
                </View>
                <View style={styles.secureTag}>
                    <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
                    <Text variant="label" color={colors.primaryDark}>Secure</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.formSection}>
                <Text variant="label" color={colors.neutrals.textSecondary}>Teaching Mode</Text>
                <Spacer size="sm" />
                <View style={styles.modeGrid}>
                    {modeLabels.map((item) => {
                        const isActive = item.value === mode;
                        return (
                            <TouchableOpacity
                                key={item.value}
                                style={[styles.modeButton, isActive && styles.modeButtonActive]}
                                onPress={() => onModeChange(item.value)}
                                activeOpacity={0.7}
                            >
                                <Text variant="bodySmall" weight="bold" color={isActive ? colors.primaryDark : colors.neutrals.textPrimary}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.formSection}>
                <View style={styles.labelHeader}>
                    <Text variant="label" color={colors.neutrals.textSecondary}>Preferred Time</Text>
                    {availabilitySlots && availabilitySlots.length > 0 && (
                        <TouchableOpacity onPress={onSelectFromSchedule}>
                            <Text variant="label" color={colors.primary} weight="heavy">View Calendar</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Input
                    placeholder="e.g. Tuesday at 18:00"
                    value={preferredDate ?? ''}
                    onChangeText={onPreferredDateChange}
                    style={styles.input}
                />
            </View>

            <View style={styles.formSection}>
                <Text variant="label" color={colors.neutrals.textSecondary}>Your Message</Text>
                <Input
                    placeholder="Briefly describe what you'd like to learn..."
                    value={message}
                    onChangeText={onMessageChange}
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                />
            </View>

            <Button
                title={ctaTitle ?? "Send Request"}
                onPress={onCtaPress ?? onSubmit}
                isLoading={isSubmitting}
                size="lg"
                disabled={!!ctaDisabled}
                fullWidth
            />

            <View style={styles.footer}>
                <View style={styles.responseRow}>
                    <Ionicons name="flash" size={12} color={colors.warning} />
                    <Text variant="caption" weight="bold">
                        {responseTimeText || 'Replies within a few hours'}
                    </Text>
                </View>
                <Text variant="caption" align="center" color={colors.neutrals.textMuted}>
                    Free cancellation up to 24h before lesson
                </Text>
            </View>
        </View>
    );
}

function Spacer({ size = 'md' }: { size?: keyof typeof spacing }) {
    return <View style={{ height: spacing[size] }} />;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.floating,
        ...Platform.select({
            web: {
                maxWidth: 400,
            } as any,
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    secureTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.border,
        marginVertical: spacing.lg,
        opacity: 0.5,
    },
    formSection: {
        marginBottom: spacing.lg,
    },
    modeGrid: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    modeButtonActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    labelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    input: {
        marginTop: 0,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        marginTop: spacing.md,
        alignItems: 'center',
        gap: spacing.xs,
    },
    responseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});

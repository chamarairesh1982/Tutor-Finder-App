import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { AvailabilitySlot } from '../types';

interface AvailabilityScheduleProps {
    slots: AvailabilitySlot[];
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AvailabilitySchedule({ slots }: AvailabilityScheduleProps) {
    if (!slots || slots.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No specific hours listed. Contact the tutor for availability.</Text>
            </View>
        );
    }

    // Group slots by day
    const grouped = slots.reduce((acc, slot) => {
        const day = days[slot.dayOfWeek];
        if (!acc[day]) acc[day] = [];
        acc[day].push(slot);
        return acc;
    }, {} as Record<string, AvailabilitySlot[]>);

    // Sort days starting from Monday
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <View style={styles.container}>
            {dayOrder.map((dayName) => {
                const daySlots = grouped[dayName];
                const dayIndex = days.indexOf(dayName);

                return (
                    <View key={dayName} style={styles.dayRow}>
                        <View style={styles.dayLabelContainer}>
                            <Text style={[styles.dayName, !daySlots && styles.dayNameInactive]}>
                                {dayName.substring(0, 3)}
                            </Text>
                        </View>
                        <View style={styles.slotsContainer}>
                            {daySlots ? (
                                daySlots.map((slot, idx) => (
                                    <View key={idx} style={styles.slotBadge}>
                                        <Text style={styles.slotText}>
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.unavailableText}>Unavailable</Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

function formatTime(timeStr: string) {
    if (!timeStr) return '';
    // Handle both HH:mm:ss and HH:mm
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: spacing.sm,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    dayLabelContainer: {
        width: 50,
    },
    dayName: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    dayNameInactive: {
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.medium,
    },
    slotsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    slotBadge: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    slotText: {
        fontSize: 11,
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.semibold,
    },
    unavailableText: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        fontStyle: 'italic',
    },
    emptyContainer: {
        padding: spacing.md,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.md,
    },
    emptyText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontStyle: 'italic',
    },
});

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { AvailabilitySlot } from '../types';
import { Button } from './Button';

interface SchedulePickerModalProps {
    visible: boolean;
    onClose: () => void;
    slots: AvailabilitySlot[];
    onSelect: (day: string, time: string) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SchedulePickerModal({ visible, onClose, slots, onSelect }: SchedulePickerModalProps) {
    // Group slots by day
    const grouped = slots.reduce((acc, slot) => {
        const dayName = DAYS[slot.dayOfWeek];
        if (!acc[dayName]) acc[dayName] = [];
        acc[dayName].push(slot);
        return acc;
    }, {} as Record<string, AvailabilitySlot[]>);

    // Sort days starting from Monday (idx 1)
    const sortedDays = Object.keys(grouped).sort((a, b) => {
        const idxA = DAYS.indexOf(a) === 0 ? 7 : DAYS.indexOf(a);
        const idxB = DAYS.indexOf(b) === 0 ? 7 : DAYS.indexOf(b);
        return idxA - idxB;
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Pick a regular slot</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>Select a time that suits you from the tutor's habitual schedule.</Text>

                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        {sortedDays.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No specific slots listed. You can suggest any time in your message.</Text>
                            </View>
                        ) : (
                            sortedDays.map((day) => (
                                <View key={day} style={styles.dayGroup}>
                                    <Text style={styles.dayTitle}>{day}</Text>
                                    <View style={styles.slotGrid}>
                                        {grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot, idx) => (
                                            <TouchableOpacity
                                                key={idx}
                                                style={styles.slotBtn}
                                                onPress={() => onSelect(day, slot.startTime)}
                                            >
                                                <Text style={styles.slotText}>{slot.startTime.substring(0, 5)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button title="Close" variant="outline" onPress={onClose} fullWidth />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.lg,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    closeText: {
        fontSize: 20,
        color: colors.neutrals.textMuted,
    },
    subtitle: {
        padding: spacing.lg,
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
    scroll: {
        paddingHorizontal: spacing.lg,
    },
    dayGroup: {
        marginBottom: spacing.lg,
    },
    dayTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.heavy,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },
    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    slotBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        backgroundColor: colors.primarySoft,
        ...Platform.select({ web: { cursor: 'pointer' } }),
    },
    slotText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
    },
    emptyState: {
        paddingVertical: spacing['3xl'],
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.neutrals.textMuted,
        fontSize: typography.fontSize.sm,
    },
});

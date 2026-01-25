import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../lib/theme';
import { useBreakpoint } from '../lib/responsive';
import { TeachingMode } from '../types';
import { Text } from './Text';

interface HomeSearchBarProps {
    subject: string;
    location: string;
    radius?: number;
    mode?: TeachingMode;
    onSubjectChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onRadiusChange?: (value: number) => void;
    onModeChange?: (value: TeachingMode) => void;
    availabilityDay?: number;
    onAvailabilityDayChange?: (value: number | undefined) => void;
    onSubmit: () => void;
    compact?: boolean;
}

const modeOptions: { label: string; value: TeachingMode }[] = [
    { label: 'In-person', value: TeachingMode.InPerson },
    { label: 'Online', value: TeachingMode.Online },
    { label: 'Both', value: TeachingMode.Both },
];

export function HomeSearchBar({
    subject,
    location,
    radius = 10,
    mode,
    onSubjectChange,
    onLocationChange,
    onRadiusChange,
    onModeChange,
    onSubmit,
    compact = false,
}: HomeSearchBarProps) {
    const { isLg } = useBreakpoint();
    const isStacked = !isLg && !compact;

    return (
        <View style={styles.container}>
            <View style={[
                styles.mainBox,
                isStacked && styles.mainBoxStacked,
                compact && styles.mainBoxCompact
            ]}>
                {/* Subject Input */}
                <View style={styles.inputBlock}>
                    <View style={styles.labelRow}>
                        <Ionicons name="book-outline" size={12} color={colors.primary} />
                        <Text variant="label" color={colors.neutrals.textMuted} style={styles.label}>Subject</Text>
                    </View>
                    <TextInput
                        placeholder="e.g. Maths, Piano..."
                        placeholderTextColor={colors.neutrals.placeholder}
                        value={subject}
                        onChangeText={onSubjectChange}
                        style={styles.input}
                    />
                </View>

                {!isStacked && <View style={styles.divider} />}

                {/* Location Input */}
                <View style={styles.inputBlock}>
                    <View style={styles.labelRow}>
                        <Ionicons name="location-outline" size={12} color={colors.primary} />
                        <Text variant="label" color={colors.neutrals.textMuted} style={styles.label}>Where?</Text>
                    </View>
                    <TextInput
                        placeholder="Postcode or Town"
                        placeholderTextColor={colors.neutrals.placeholder}
                        value={location}
                        onChangeText={onLocationChange}
                        style={styles.input}
                    />
                </View>

                {isLg && !compact && <View style={styles.divider} />}

                {/* Search Button */}
                <TouchableOpacity
                    style={[styles.searchBtn, compact && styles.searchBtnCompact]}
                    onPress={onSubmit}
                    activeOpacity={0.8}
                >
                    <Ionicons name="search" size={20} color="#fff" />
                    {isLg && !compact && <Text weight="heavy" color="#fff" style={{ marginLeft: 8 }}>Find Tutors</Text>}
                </TouchableOpacity>
            </View>

            {/* Filters Row */}
            {!compact && (
                <View style={[styles.filterWrapper, isLg && styles.filterWrapperWeb]}>
                    <View style={styles.modeRow}>
                        {modeOptions.map((opt) => {
                            const isActive = opt.value === mode;
                            return (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[styles.modePill, isActive && styles.modePillActive]}
                                    onPress={() => onModeChange?.(opt.value)}
                                    activeOpacity={0.7}
                                >
                                    <Text variant="caption" weight="heavy" color={isActive ? '#fff' : colors.neutrals.textMuted}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.radiusRow}>
                        <TouchableOpacity
                            style={styles.radiusPill}
                            onPress={() => {
                                const nextRadius = (radius === 50) ? 5 : (radius || 10) + 10;
                                onRadiusChange?.(nextRadius);
                            }}
                        >
                            <Ionicons name="map-outline" size={14} color={colors.primary} />
                            <Text variant="caption" weight="heavy" color={colors.neutrals.textSecondary} style={{ marginLeft: 6 }}>
                                Within {radius || 10} miles
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    mainBox: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.full,
        padding: 8,
        paddingLeft: spacing.xl,
        alignItems: 'center',
    },
    mainBoxStacked: {
        flexDirection: 'column',
        borderRadius: 24,
        padding: spacing.lg,
        alignItems: 'stretch',
        gap: spacing.md,
    },
    mainBoxCompact: {
        paddingLeft: spacing.lg,
        height: 56,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    inputBlock: {
        flex: 1,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    label: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.neutrals.textMuted,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.neutrals.textPrimary,
        padding: 0,
        ...Platform.select({
            web: { outlineStyle: 'none' }
        })
    } as any,
    divider: {
        width: 1,
        height: 40,
        backgroundColor: colors.neutrals.border,
        marginHorizontal: spacing.xl,
    },
    searchBtn: {
        backgroundColor: colors.primary,
        height: 52,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    searchBtnCompact: {
        width: 44,
        height: 44,
        paddingHorizontal: 0,
    },
    filterWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    filterWrapperWeb: {
        marginTop: spacing.xl,
        gap: spacing.xl,
    },
    modeRow: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surfaceAlt,
        padding: 4,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    modePill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
    },
    modePillActive: {
        backgroundColor: colors.primary,
        ...shadows.sm,
    },
    radiusRow: {
        flexDirection: 'row',
    },
    radiusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.sm,
    },
});

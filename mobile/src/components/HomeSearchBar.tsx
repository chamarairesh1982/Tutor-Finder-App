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
    mode,
    onSubjectChange,
    onLocationChange,
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

            {/* Premium Mode Toggle */}
            {!compact && (
                <View style={[styles.modeWrapper, isLg && styles.modeWrapperWeb]}>
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
                                    <Text variant="bodySmall" weight="heavy" color={isActive ? '#fff' : colors.neutrals.textMuted}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
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
    modeWrapper: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    modeWrapperWeb: {
        marginTop: spacing.xl,
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
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
    },
    modePillActive: {
        backgroundColor: colors.primary,
        ...shadows.sm,
    },
});

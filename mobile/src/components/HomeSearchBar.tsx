import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { useBreakpoint } from '../lib/responsive';
import { Input } from './Input';
import { Button } from './Button';
import { TeachingMode } from '../types';

interface HomeSearchBarProps {
    subject: string;
    location: string;
    radius: number;
    mode: TeachingMode;
    onSubjectChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onRadiusChange: (value: number) => void;
    onModeChange: (value: TeachingMode) => void;
    onSubmit: () => void;
}

const radiusOptions = [5, 10, 20];
const modeOptions: { label: string; value: TeachingMode }[] = [
    { label: 'In-person', value: TeachingMode.InPerson },
    { label: 'Online', value: TeachingMode.Online },
    { label: 'Both', value: TeachingMode.Both },
];

export function HomeSearchBar({
    subject,
    location,
    radius,
    mode,
    onSubjectChange,
    onLocationChange,
    onRadiusChange,
    onModeChange,
    onSubmit,
}: HomeSearchBarProps) {
    const { isMd, isLg } = useBreakpoint();
    const [radiusOpen, setRadiusOpen] = useState(false);

    const stacked = !isLg;

    const dropdownSpacer = radiusOpen ? 140 : 0;

    return (
        <View style={styles.wrapper}>
            <View style={[styles.row, stacked && styles.wrap, styles.alignStart]}>
                <View style={[styles.fieldGroup, stacked && styles.fieldGroupFull]}>
                    <Input
                        label="Subject"
                        placeholder="e.g. Maths, Piano, GCSE Chemistry"
                        value={subject}
                        onChangeText={onSubjectChange}
                        autoCapitalize="words"
                        returnKeyType="search"
                    />
                </View>

                <View style={[styles.fieldGroup, stacked && styles.fieldGroupFull]}>
                    <Input
                        label="Location"
                        placeholder="Postcode or town"
                        value={location}
                        onChangeText={onLocationChange}
                        autoCapitalize="characters"
                        returnKeyType="search"
                    />
                </View>

                <View style={[styles.radiusGroup, stacked && styles.fieldGroupFull]}>
                    <Text style={styles.label}>Radius</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.radiusControl}
                        onPress={() => setRadiusOpen((prev) => !prev)}
                    >
                        <Text style={styles.radiusValue}>{radius} miles</Text>
                        <Text style={styles.chevron}>{radiusOpen ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                    {radiusOpen && (
                        <View style={styles.radiusMenu}>
                            {radiusOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.radiusOption, option === radius && styles.radiusOptionActive]}
                                    onPress={() => {
                                        onRadiusChange(option);
                                        setRadiusOpen(false);
                                    }}
                                >
                                    <Text style={[styles.radiusOptionText, option === radius && styles.radiusOptionTextActive]}>
                                        {option} miles
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {radiusOpen && <View style={{ height: dropdownSpacer }} />}
                </View>
            </View>

            <View style={[styles.row, styles.modeRow, stacked && styles.wrap]}>
                <View style={[styles.modeGroup, stacked && styles.fieldGroupFull]}>
                    <Text style={styles.label}>Mode</Text>
                    <View style={styles.modePills}>
                        {modeOptions.map((item) => {
                            const isActive = item.value === mode;
                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[styles.modePill, isActive && styles.modePillActive]}
                                    onPress={() => onModeChange(item.value)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={[styles.modePillText, isActive && styles.modePillTextActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.ctaWrapper, stacked && styles.ctaFull]}>
                    <Button title="Find tutors" onPress={onSubmit} fullWidth size="lg" />
                    <Text style={styles.helperText}>Trusted, verified tutors across the UK</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.md,
        gap: spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
        flexWrap: 'nowrap',
    },
    wrap: {
        flexWrap: 'wrap',
    },
    alignStart: {
        alignItems: 'flex-start',
    },
    fieldGroup: {
        flex: 1,
        minWidth: 220,
    },
    fieldGroupFull: {
        width: '100%',
        minWidth: '100%',
    },
    radiusGroup: {
        width: 200,
        position: 'relative',
        zIndex: 20,
        flexShrink: 0,
    },
    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    radiusControl: {
        height: 52,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Platform.select({
            web: { cursor: 'pointer' },
        }),
    },
    radiusValue: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textPrimary,
    },
    chevron: {
        color: colors.neutrals.textSecondary,
    },
    radiusMenu: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: spacing.xs,
        left: 0,
        right: 0,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        borderRadius: borderRadius.md,
        ...shadows.sm,
        zIndex: 50,
    },
    radiusOption: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    radiusOptionActive: {
        backgroundColor: colors.primarySoft,
    },
    radiusOptionText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
    },
    radiusOptionTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.semibold,
    },
    modeRow: {
        alignItems: 'center',
        justifyContent: 'space-between',
        rowGap: spacing.sm,
    },
    modeGroup: {
        flex: 1,
    },
    modePills: {
        flexDirection: 'row',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    modePill: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    modePillActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    modePillText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textSecondary,
    },
    modePillTextActive: {
        color: colors.primary,
    },
    ctaWrapper: {
        width: 240,
        alignItems: 'flex-start',
        gap: spacing.xs,
    },
    ctaFull: {
        width: '100%',
    },
    helperText: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
    },
});

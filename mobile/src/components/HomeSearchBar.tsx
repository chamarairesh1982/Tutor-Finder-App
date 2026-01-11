import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    const { isLg } = useBreakpoint();
    const [radiusOpen, setRadiusOpen] = useState(false);

    const stacked = !isLg;

    return (
        <View style={styles.container}>
            <View style={[styles.mainRow, stacked && styles.mainRowStacked]}>
                <View style={styles.inputContainer}>
                    <Text style={styles.innerLabel}>What do you want to learn?</Text>
                    <Input
                        placeholder="e.g. Maths, Piano, GCSE Chemistry"
                        value={subject}
                        onChangeText={onSubjectChange}
                        autoCapitalize="words"
                        returnKeyType="search"
                        containerStyle={styles.borderlessInput}
                        style={{ fontSize: 15, paddingLeft: 0 }}
                    />
                </View>

                <View style={styles.divider} />

                <View style={[styles.inputContainer, styles.locationContainer]}>
                    <Text style={styles.innerLabel}>Where?</Text>
                    <View style={styles.locationRow}>
                        <Input
                            placeholder="Postcode or town"
                            value={location}
                            onChangeText={onLocationChange}
                            autoCapitalize="characters"
                            returnKeyType="search"
                            containerStyle={[styles.borderlessInput, { flex: 1 }]}
                            style={{ fontSize: 15, paddingLeft: 0 }}
                        />
                        <View style={styles.radiusControlWrapper}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.radiusToggle}
                                onPress={() => setRadiusOpen(!radiusOpen)}
                            >
                                <Text style={styles.radiusText}>{radius} mi</Text>
                                <Ionicons name={radiusOpen ? "caret-up" : "caret-down"} size={10} color={colors.neutrals.textMuted} />
                            </TouchableOpacity>

                            {radiusOpen && (
                                <View style={styles.radiusMenu}>
                                    {radiusOptions.map((opt) => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[styles.radiusOpt, opt === radius && styles.radiusOptActive]}
                                            onPress={() => {
                                                onRadiusChange(opt);
                                                setRadiusOpen(false);
                                            }}
                                        >
                                            <Text style={[styles.radiusOptText, opt === radius && styles.radiusOptTextActive]}>{opt} miles</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.searchButton} onPress={onSubmit} activeOpacity={0.9}>
                    <Ionicons name="search" size={20} color={colors.neutrals.surface} />
                    {isLg && <Text style={styles.searchButtonText}>Search</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.modeRow}>
                {modeOptions.map((opt) => {
                    const isActive = opt.value === mode;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.modePill, isActive && styles.modePillActive]}
                            onPress={() => onModeChange(opt.value)}
                        >
                            <Text style={[styles.modePillText, isActive && styles.modePillTextActive]}>{opt.label}</Text>
                        </TouchableOpacity>
                    );
                })}
                <View style={styles.helperDot} />
                <Text style={styles.helperText}>Verified Experts only</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: spacing.md,
    },
    mainRow: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surface,
        borderRadius: 32, // More rounded like the screenshot
        padding: 6,
        paddingLeft: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.lg, // Stronger shadow
    },
    mainRowStacked: {
        flexDirection: 'column',
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        alignItems: 'stretch',
    },
    inputContainer: {
        flex: 1.2,
        justifyContent: 'center',
        paddingVertical: spacing.xs,
    },
    locationContainer: {
        flex: 1,
    },
    innerLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: -4,
        paddingLeft: Platform.OS === 'web' ? 0 : spacing.xs,
    },
    borderlessInput: {
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: colors.neutrals.cardBorder,
        marginHorizontal: spacing.md,
        ...Platform.select({
            web: { display: 'flex' } as any,
            default: { display: 'none' } as any
        })
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radiusControlWrapper: {
        position: 'relative',
        zIndex: 100,
    },
    radiusToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
        marginRight: spacing.sm,
    },
    radiusText: {
        fontSize: 12,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    chevron: {
        fontSize: 10,
        color: colors.neutrals.textMuted,
    },
    radiusMenu: {
        position: 'absolute',
        top: '100%',
        marginTop: spacing.xs,
        right: 0,
        width: 120,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
        zIndex: 200,
    },
    radiusOpt: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    radiusOptActive: {
        backgroundColor: colors.primarySoft,
    },
    radiusOptText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
    },
    radiusOptTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    searchButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        ...shadows.sm,
    },
    searchButtonText: {
        color: colors.neutrals.surface,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
    searchButtonIcon: {
        fontSize: 16,
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    modePill: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    modePillActive: {
        backgroundColor: 'rgba(217, 70, 239, 0.1)',
        borderColor: 'rgba(217, 70, 239, 0.2)',
    },
    modePillText: {
        fontSize: 12,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    modePillTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    helperDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.neutrals.textMuted,
        marginHorizontal: spacing.xs,
    },
    helperText: {
        fontSize: 11,
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.medium,
    },
});

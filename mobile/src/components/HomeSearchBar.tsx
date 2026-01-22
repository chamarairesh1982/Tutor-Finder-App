import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { useBreakpoint } from '../lib/responsive';
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
    availabilityDay?: number;
    onAvailabilityDayChange?: (value: number | undefined) => void;
    onSubmit: () => void;
}

const radiusOptions = [5, 10, 20];
const modeOptions: { label: string; value: TeachingMode }[] = [
    { label: 'In-person', value: TeachingMode.InPerson },
    { label: 'Online', value: TeachingMode.Online },
    { label: 'Both', value: TeachingMode.Both },
];

const dayOptions = [
    { label: 'Any day', value: undefined },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 0 },
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
    availabilityDay,
    onAvailabilityDayChange,
    onSubmit,
}: HomeSearchBarProps) {
    const { isLg } = useBreakpoint();
    const [radiusOpen, setRadiusOpen] = useState(false);
    const [dayOpen, setDayOpen] = useState(false);

    const stacked = !isLg;

    return (
        <View style={styles.container}>
            <View style={[styles.mainRow, stacked && styles.mainRowStacked]}>
                <View style={styles.inputContainer}>
                    <Text style={styles.innerLabel}>What do you want to learn?</Text>
                    <TextInput
                        placeholder="e.g. Maths, Piano, GCSE Chemistry"
                        placeholderTextColor={colors.neutrals.textMuted}
                        value={subject}
                        onChangeText={onSubjectChange}
                        autoCapitalize="words"
                        returnKeyType="search"
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.divider} />

                <View style={[styles.inputContainer, styles.locationContainer]}>
                    <Text style={styles.innerLabel}>Where?</Text>
                    <View style={styles.locationRow}>
                        <TextInput
                            placeholder="Postcode or town"
                            placeholderTextColor={colors.neutrals.textMuted}
                            value={location}
                            onChangeText={onLocationChange}
                            autoCapitalize="characters"
                            returnKeyType="search"
                            style={[styles.textInput, { flex: 1 }]}
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

                <View style={[styles.inputContainer, { flex: 0.6, zIndex: 70 }]}>
                    <Text style={styles.innerLabel}>When?</Text>
                    <View style={styles.radiusControlWrapper}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.radiusToggle}
                            onPress={() => setDayOpen(!dayOpen)}
                        >
                            <Text style={styles.radiusText}>
                                {dayOptions.find(d => d.value === availabilityDay)?.label || 'Any day'}
                            </Text>
                            <Ionicons name={dayOpen ? "caret-up" : "caret-down"} size={10} color={colors.neutrals.textMuted} />
                        </TouchableOpacity>

                        {dayOpen && (
                            <View style={[styles.radiusMenu, { left: 0, right: 'auto', zIndex: 10000 }]}>
                                {dayOptions.map((opt) => (
                                    <TouchableOpacity
                                        key={String(opt.value)}
                                        style={[styles.radiusOpt, opt.value === availabilityDay && styles.radiusOptActive]}
                                        onPress={() => {
                                            onAvailabilityDayChange?.(opt.value);
                                            setDayOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.radiusOptText, opt.value === availabilityDay && styles.radiusOptTextActive]}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
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
        borderRadius: 32,
        padding: 6,
        paddingLeft: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.lg,
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
        paddingRight: spacing.sm,
        zIndex: 50, // Added to help dropdown layer correctly
    },
    locationContainer: {
        flex: 1,
        zIndex: 60, // Slightly higher to beat previous inputs if needed
    },
    innerLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
        paddingLeft: Platform.OS === 'web' ? 0 : spacing.xs,
    },
    textInput: {
        fontSize: 15,
        paddingVertical: 0,
        paddingHorizontal: Platform.OS === 'web' ? 0 : spacing.xs,
        height: 24,
        color: colors.neutrals.textPrimary,
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
    radiusMenu: {
        position: 'absolute',
        top: '110%',
        marginTop: spacing.xs,
        right: 0,
        width: 140, // Slightly wider
        backgroundColor: colors.neutrals.surface, // Essential: Solid white background
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, // Consistent shadow
        shadowRadius: 12,
        elevation: 10,
        zIndex: 9999, // Super high z-index
        padding: 4,
    },
    radiusOpt: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
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

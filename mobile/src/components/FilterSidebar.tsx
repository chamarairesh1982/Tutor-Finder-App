import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { TeachingMode } from '../types';
import { Button } from './Button';
import { Slider } from './Slider';
import { RangeSlider } from './RangeSlider';

export interface SearchFiltersState {
    radiusMiles: number;
    mode?: TeachingMode;
    minRating?: number;
    priceMin?: number;
    priceMax?: number;
    quickFilters: {
        dbs: boolean;
        weekends: boolean;
        rating45: boolean;
        midPrice: boolean;
    };
}

interface FilterSidebarProps {
    filters: SearchFiltersState;
    onChange: (next: SearchFiltersState) => void;
    onClose?: () => void;
    compact?: boolean;
}

const quickFilterConfig = [
    { key: 'dbs' as const, label: 'DBS' },
    { key: 'rating45' as const, label: '4.5+' },
    { key: 'weekends' as const, label: 'Available weekends' },
    { key: 'midPrice' as const, label: '£20–£40' },
];

export function FilterSidebar({ filters, onChange, onClose, compact = false }: FilterSidebarProps) {
    const toggleQuick = (key: keyof SearchFiltersState['quickFilters']) => {
        const nextQuick = { ...filters.quickFilters, [key]: !filters.quickFilters[key] };
        const next: SearchFiltersState = { ...filters, quickFilters: nextQuick };

        if (key === 'rating45') {
            next.minRating = nextQuick.rating45 ? 4.5 : undefined;
        }
        if (key === 'midPrice') {
            next.priceMin = nextQuick.midPrice ? 20 : undefined;
            next.priceMax = nextQuick.midPrice ? 40 : undefined;
        }

        onChange(next);
    };

    const setMode = (value?: TeachingMode) => {
        onChange({ ...filters, mode: value });
    };

    const setRadius = (value: number) => {
        onChange({ ...filters, radiusMiles: value });
    };

    return (
        <View style={[styles.container, compact && styles.compact]}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Filters</Text>
                {onClose && (
                    <TouchableOpacity onPress={onClose} accessibilityRole="button">
                        <Text style={styles.close}>Close</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.sectionLabel}>Price range (£/hr)</Text>
            <RangeSlider
                min={0}
                max={100}
                initialMin={filters.priceMin ?? 0}
                initialMax={filters.priceMax ?? 100}
                onMinChange={(val) => onChange({ ...filters, priceMin: val })}
                onMaxChange={(val) => onChange({ ...filters, priceMax: val })}
            />

            <Text style={styles.sectionLabel}>Minimum Rating</Text>
            <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = (filters.minRating || 0) >= star;
                    return (
                        <TouchableOpacity
                            key={star}
                            onPress={() => onChange({ ...filters, minRating: star })}
                            style={styles.starTouch}
                        >
                            <Ionicons
                                name={isActive ? "star" : "star-outline"}
                                size={28}
                                color={isActive ? colors.ratingStars : colors.neutrals.border}
                            />
                        </TouchableOpacity>
                    );
                })}
                {filters.minRating && (
                    <TouchableOpacity onPress={() => onChange({ ...filters, minRating: undefined })}>
                        <Text style={styles.clearRating}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.sectionLabel}>Distance ({filters.radiusMiles} miles)</Text>
            <Slider
                min={1}
                max={50}
                value={filters.radiusMiles}
                onChange={(val) => onChange({ ...filters, radiusMiles: val })}
            />

            <Text style={styles.sectionLabel}>Quick picks</Text>
            <View style={styles.chipRow}>
                {quickFilterConfig.map((chip) => {
                    const isActive = filters.quickFilters[chip.key];
                    return (
                        <TouchableOpacity
                            key={chip.key}
                            style={[styles.chip, isActive && styles.chipActive]}
                            onPress={() => toggleQuick(chip.key)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={styles.sectionLabel}>Teaching mode</Text>
            <View style={styles.modeRow}>
                {[TeachingMode.InPerson, TeachingMode.Online, TeachingMode.Both].map((value) => {
                    const isActive = filters.mode === value;
                    const label = value === TeachingMode.InPerson ? 'In-person' : value === TeachingMode.Online ? 'Online' : 'Both';
                    return (
                        <TouchableOpacity
                            key={value}
                            style={[styles.modeButton, isActive && styles.modeButtonActive]}
                            onPress={() => setMode(value)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.modeText, isActive && styles.modeTextActive]}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.divider} />

            <View style={styles.footerButtons}>
                <Button title="Show Results" onPress={onClose || (() => { })} fullWidth size="md" />
                <TouchableOpacity onPress={() => onChange({
                    radiusMiles: 10,
                    quickFilters: { dbs: false, weekends: false, rating45: false, midPrice: false }
                })} style={{ alignSelf: 'center' }}>
                    <Text style={styles.clearAllText}>Clear all filters</Text>
                </TouchableOpacity>
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
        ...shadows.sm,
        gap: spacing.lg,
    },
    compact: {
        padding: spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    close: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
        ...Platform.select({ web: { cursor: 'pointer' } }),
    },
    chipActive: {
        backgroundColor: 'rgba(217, 70, 239, 0.1)',
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    chipTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    modeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    modeButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
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
        fontWeight: typography.fontWeight.semibold,
    },
    modeTextActive: {
        color: colors.primaryDark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.cardBorder,
        opacity: 0.5,
    },
    footerButtons: {
        gap: spacing.md,
        marginTop: spacing.md,
    },
    helper: {
        fontSize: 11,
        color: colors.neutrals.textMuted,
        textAlign: 'center',
        lineHeight: 16,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    priceInputWrapper: {
        flex: 1,
    },
    priceLabelSmall: {
        fontSize: 10,
        color: colors.neutrals.textMuted,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    priceInputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        height: 44,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    priceCurrency: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        marginRight: 4,
    },
    priceTextInput: {
        flex: 1,
        fontSize: 16,
        color: colors.neutrals.textPrimary,
        height: '100%',
        padding: 0,
    },
    priceDivider: {
        width: 12,
        height: 1,
        backgroundColor: colors.neutrals.cardBorder,
        marginTop: 18, // Align with inputs
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    starTouch: {
        padding: 2,
    },
    clearRating: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
        marginLeft: spacing.md,
    },
    clearAllText: {
        fontSize: 14,
        color: colors.neutrals.textMuted,
        textDecorationLine: 'underline',
        marginTop: spacing.sm,
    },
});

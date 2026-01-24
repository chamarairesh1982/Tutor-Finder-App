import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../lib/theme';
import { TeachingMode } from '../types';
import { Button } from './Button';
import { Slider } from './Slider';
import { RangeSlider } from './RangeSlider';
import { Text } from './Text';
import { Spacer } from './Layout';

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
    { key: 'dbs' as const, label: 'DBS Verified', icon: 'shield-checkmark-outline' },
    { key: 'rating45' as const, label: 'Top Rated 4.5+', icon: 'star-outline' },
    { key: 'weekends' as const, label: 'Weekends', icon: 'calendar-outline' },
    { key: 'midPrice' as const, label: 'Budget Friendly', icon: 'cash-outline' },
];

export function FilterSidebar({ filters, onChange, onClose, compact = false }: FilterSidebarProps) {
    const toggleQuick = (key: keyof SearchFiltersState['quickFilters']) => {
        const nextQuick = { ...filters.quickFilters, [key]: !filters.quickFilters[key] };
        const next: SearchFiltersState = { ...filters, quickFilters: nextQuick };

        if (key === 'rating45') next.minRating = nextQuick.rating45 ? 4.5 : undefined;
        if (key === 'midPrice') {
            next.priceMin = nextQuick.midPrice ? 15 : undefined;
            next.priceMax = nextQuick.midPrice ? 35 : undefined;
        }
        onChange(next);
    };

    return (
        <View style={[styles.container, compact && styles.compact]}>
            <View style={styles.header}>
                <View>
                    <Text variant="h3" weight="heavy">Filters</Text>
                    <Text variant="caption" color={colors.neutrals.textMuted}>Refine your search results</Text>
                </View>
                {onClose && Platform.OS !== 'web' && (
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.neutrals.textPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text variant="label" color={colors.neutrals.textSecondary} weight="heavy">Price Range (£/hr)</Text>
                        <Text variant="bodySmall" weight="bold" color={colors.primary}>
                            £{filters.priceMin || 0} - £{filters.priceMax || 100}
                        </Text>
                    </View>
                    <Spacer size="md" />
                    <RangeSlider
                        min={0}
                        max={100}
                        initialMin={filters.priceMin ?? 0}
                        initialMax={filters.priceMax ?? 100}
                        onMinChange={(val) => onChange({ ...filters, priceMin: val })}
                        onMaxChange={(val) => onChange({ ...filters, priceMax: val })}
                    />
                </View>

                <View style={styles.section}>
                    <Text variant="label" color={colors.neutrals.textSecondary} weight="heavy">Minimum Rating</Text>
                    <Spacer size="sm" />
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isActive = (filters.minRating || 0) >= star;
                            return (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => onChange({ ...filters, minRating: star })}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={isActive ? "star" : "star-outline"}
                                        size={24}
                                        color={isActive ? colors.ratingStars : colors.neutrals.border}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                        {filters.minRating && (
                            <TouchableOpacity onPress={() => onChange({ ...filters, minRating: undefined })}>
                                <Text variant="caption" color={colors.primary} weight="heavy" style={{ marginLeft: spacing.md }}>Clear</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text variant="label" color={colors.neutrals.textSecondary} weight="heavy">Distance</Text>
                        <Text variant="bodySmall" weight="bold" color={colors.primary}>{filters.radiusMiles} miles</Text>
                    </View>
                    <Spacer size="md" />
                    <Slider
                        min={1}
                        max={50}
                        value={filters.radiusMiles}
                        onChange={(val) => onChange({ ...filters, radiusMiles: val })}
                    />
                </View>

                <View style={styles.section}>
                    <Text variant="label" color={colors.neutrals.textSecondary} weight="heavy">Quick Selects</Text>
                    <Spacer size="sm" />
                    <View style={styles.chipRow}>
                        {quickFilterConfig.map((chip) => {
                            const isActive = filters.quickFilters[chip.key];
                            return (
                                <TouchableOpacity
                                    key={chip.key}
                                    style={[styles.chip, isActive && styles.chipActive]}
                                    onPress={() => toggleQuick(chip.key)}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name={chip.icon as any} size={14} color={isActive ? colors.primary : colors.neutrals.textSecondary} />
                                    <Text variant="caption" weight="heavy" color={isActive ? colors.primary : colors.neutrals.textPrimary} style={{ marginLeft: 6 }}>
                                        {chip.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="label" color={colors.neutrals.textSecondary} weight="heavy">Teaching Options</Text>
                    <Spacer size="sm" />
                    <View style={styles.modeRow}>
                        {[TeachingMode.InPerson, TeachingMode.Online, TeachingMode.Both].map((val) => {
                            const isActive = filters.mode === val;
                            const label = val === TeachingMode.InPerson ? 'In-person' : val === TeachingMode.Online ? 'Online' : 'Both';
                            const icon = val === TeachingMode.InPerson ? 'people' : val === TeachingMode.Online ? 'videocam' : 'layers';

                            return (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.modeBtn, isActive && styles.modeBtnActive]}
                                    onPress={() => onChange({ ...filters, mode: val })}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name={icon as any} size={16} color={isActive ? '#fff' : colors.neutrals.textSecondary} />
                                    <Spacer size={4} horizontal />
                                    <Text variant="caption" weight="heavy" color={isActive ? '#fff' : colors.neutrals.textPrimary}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Apply Filters"
                    onPress={onClose || (() => { })}
                    size="lg"
                    variant="primary"
                    fullWidth
                />
                <TouchableOpacity
                    onPress={() => onChange({
                        radiusMiles: 10,
                        quickFilters: { dbs: false, weekends: false, rating45: false, midPrice: false }
                    })}
                    style={styles.clearAll}
                >
                    <Text variant="label" color={colors.neutrals.textMuted} weight="heavy">Reset to Defaults</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutrals.surface,
        padding: spacing.xl,
        flex: 1,
    },
    compact: {
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.xl,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        backgroundColor: colors.neutrals.surface,
    },
    chipActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    modeRow: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surfaceAlt,
        padding: 4,
        borderRadius: 14,
        gap: 4,
    },
    modeBtn: {
        flex: 1,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    modeBtnActive: {
        backgroundColor: colors.primary,
        ...shadows.sm,
    },
    footer: {
        marginTop: 'auto',
        gap: spacing.lg,
        paddingTop: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
    },
    clearAll: {
        alignSelf: 'center',
        paddingVertical: spacing.sm,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

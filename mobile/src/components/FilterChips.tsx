import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../lib/theme';

interface FilterChip {
    key: string;
    label: string;
}

interface FilterChipsProps {
    chips: FilterChip[];
    selectedKeys: string[];
    onSelect: (key: string) => void;
    multiSelect?: boolean;
}

export function FilterChips({ chips, selectedKeys, onSelect, multiSelect = true }: FilterChipsProps) {
    const handlePress = (key: string) => {
        onSelect(key);
    };

    return (
        <View style={styles.scrollWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                {chips.map((chip) => {
                    const isSelected = selectedKeys.includes(chip.key);
                    return (
                        <TouchableOpacity
                            key={chip.key}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={() => handlePress(chip.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {chip.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollWrapper: {
        height: 48, // Fixed height for the filter row
        marginVertical: spacing.sm,
    },
    container: {
        flexGrow: 0,
    },
    contentContainer: {
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surfaceAlt,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textPrimary,
    },
    chipTextSelected: {
        color: colors.neutrals.background,
    },
});

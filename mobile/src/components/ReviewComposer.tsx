import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { Button } from './Button';

interface ReviewComposerProps {
    rating: number;
    onRatingChange: (value: number) => void;
    comment: string;
    onCommentChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    isEnabled: boolean;
    helperText?: string;
}

export function ReviewComposer({
    rating,
    onRatingChange,
    comment,
    onCommentChange,
    onSubmit,
    isSubmitting,
    isEnabled,
    helperText,
}: ReviewComposerProps) {
    const stars = useMemo(() => [1, 2, 3, 4, 5], []);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Leave a review</Text>
                {!!helperText && <Text style={styles.helper}>{helperText}</Text>}
            </View>

            <View style={styles.starsRow}>
                {stars.map((s) => {
                    const active = s <= rating;
                    return (
                        <TouchableOpacity
                            key={s}
                            onPress={() => isEnabled && onRatingChange(s)}
                            activeOpacity={0.8}
                            style={[styles.starPill, active && styles.starPillActive, !isEnabled && styles.starPillDisabled]}
                        >
                            <Text style={[styles.starText, active && styles.starTextActive]}>★ {s}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TextInput
                value={comment}
                onChangeText={onCommentChange}
                placeholder="Share what was great (and what could improve)…"
                placeholderTextColor={colors.neutrals.textMuted}
                editable={isEnabled}
                multiline
                style={[styles.input, !isEnabled && styles.inputDisabled]}
            />

            <Button
                title={isEnabled ? 'Submit Review' : 'Review Unlocks After Completion'}
                onPress={onSubmit}
                isLoading={isSubmitting}
                fullWidth
                disabled={!isEnabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        gap: spacing.md,
    },
    headerRow: {
        gap: 4,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    helper: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
    },
    starsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    starPill: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    starPillActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    starPillDisabled: {
        opacity: 0.6,
    },
    starText: {
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    starTextActive: {
        color: colors.primaryDark,
    },
    input: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        backgroundColor: colors.neutrals.background,
        textAlignVertical: 'top',
    },
    inputDisabled: {
        opacity: 0.7,
    },
});

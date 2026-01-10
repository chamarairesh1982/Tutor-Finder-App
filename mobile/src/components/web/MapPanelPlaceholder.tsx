import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../lib/theme';
import { TutorSearchResult } from '../../types';

interface MapPanelPlaceholderProps {
    tutors: TutorSearchResult[];
    activeTutorId?: string;
}

export function MapPanelPlaceholder({ tutors, activeTutorId }: MapPanelPlaceholderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Map preview</Text>
                <Text style={styles.caption}>Web map coming soon</Text>
            </View>
            <View style={styles.grid}>
                {Array.from({ length: 6 }).map((_, idx) => (
                    <View key={idx} style={styles.mapCell} />
                ))}
            </View>
            <FlatList
                data={tutors.slice(0, 6)}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => {
                    const isActive = item.id === activeTutorId;
                    return (
                        <View style={[styles.pinRow, isActive && styles.pinRowActive]}>
                            <View style={[styles.pinDot, isActive && styles.pinDotActive]} />
                            <View style={styles.pinTextWrapper}>
                                <Text style={styles.pinTitle} numberOfLines={1}>{item.fullName}</Text>
                                <Text style={styles.pinMeta} numberOfLines={1}>
                                    {item.distanceMiles ? `${item.distanceMiles.toFixed(1)} mi` : 'Distance coming soon'} · {item.nextAvailableText}
                                </Text>
                            </View>
                        </View>
                    );
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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
        ...shadows.sm,
        minHeight: 360,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    caption: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    mapCell: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primarySoft,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    listContent: {
        paddingBottom: spacing.sm,
    },
    pinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.xs,
        borderRadius: borderRadius.md,
    },
    pinRowActive: {
        backgroundColor: colors.primarySoft,
    },
    pinDot: {
        width: 10,
        height: 10,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.textMuted,
        marginRight: spacing.sm,
    },
    pinDotActive: {
        backgroundColor: colors.primary,
    },
    pinTextWrapper: {
        flex: 1,
    },
    pinTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    pinMeta: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
    },
    separator: {
        height: 1,
        backgroundColor: colors.neutrals.border,
        opacity: 0.6,
    },
});

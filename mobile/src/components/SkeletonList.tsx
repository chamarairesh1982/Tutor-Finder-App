import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { colors, borderRadius, spacing } from '../lib/theme';

export function SkeletonList({ count = 3, variant = 'mobile' }: { count?: number; variant?: 'mobile' | 'web' }) {
    return (
        <View style={[styles.container, variant === 'web' && styles.containerWeb]}>
            {Array.from({ length: count }).map((_, index) => (
                variant === 'web' ? <SkeletonCardWeb key={index} /> : <SkeletonCard key={index} />
            ))}
        </View>
    );
}

function SkeletonCardWeb() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <View style={styles.cardWeb}>
            <View style={styles.accentBar} />
            <View style={styles.content}>
                <View style={styles.avatarCol}>
                    <Animated.View style={[styles.avatar, { opacity }]} />
                    <View style={styles.badgeCol}>
                        <Animated.View style={[styles.badge, { opacity, width: 60 }]} />
                        <Animated.View style={[styles.badge, { opacity, width: 80 }]} />
                    </View>
                </View>

                <View style={styles.infoCol}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Animated.View style={[styles.titleLine, { opacity, width: '40%' }]} />
                            <Animated.View style={[styles.subtitleLine, { opacity, width: '20%' }]} />
                        </View>
                        <Animated.View style={[styles.priceTagSkeleton, { opacity }]} />
                    </View>

                    <View style={styles.subjectRow}>
                        <Animated.View style={[styles.chip, { opacity, width: 60, height: 20 }]} />
                        <Animated.View style={[styles.chip, { opacity, width: 80, height: 20 }]} />
                        <Animated.View style={[styles.chip, { opacity, width: 70, height: 20 }]} />
                    </View>

                    <View style={styles.metaRowWeb}>
                        <Animated.View style={[styles.metaItem, { opacity }]} />
                        <Animated.View style={[styles.metaItem, { opacity }]} />
                        <Animated.View style={[styles.metaItem, { opacity }]} />
                    </View>

                    <View style={styles.footerRow}>
                        <Animated.View style={[styles.chip, { opacity, width: 100 }]} />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Animated.View style={[styles.buttonSmall, { opacity }]} />
                            <Animated.View style={[styles.buttonSmall, { opacity }]} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

function SkeletonCard() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                {/* Avatar Skeleton */}
                <Animated.View style={[styles.avatar, { opacity }]} />

                {/* Info Column Skeleton */}
                <View style={styles.infoCol}>
                    <Animated.View style={[styles.titleLine, { opacity }]} />
                    <Animated.View style={[styles.subtitleLine, { opacity }]} />

                    <View style={styles.metaRow}>
                        <Animated.View style={[styles.metaItem, { opacity }]} />
                        <Animated.View style={[styles.metaItem, { opacity }]} />
                    </View>

                    <View style={styles.footerRow}>
                        <Animated.View style={[styles.chip, { opacity }]} />
                        <Animated.View style={[styles.button, { opacity }]} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.lg,
    },
    containerWeb: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.sm,
    },
    card: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    cardWeb: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        overflow: 'hidden',
        width: '100%',
        marginBottom: spacing.md,
    },
    accentBar: {
        height: 6,
        backgroundColor: colors.neutrals.surfaceAlt,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        gap: spacing.lg,
        padding: spacing.lg,
    },
    avatarCol: {
        width: 100,
        alignItems: 'center',
        gap: spacing.md,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    badgeCol: {
        gap: 4,
        width: '100%',
    },
    badge: {
        height: 12,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignSelf: 'center',
    },
    infoCol: {
        flex: 1,
        gap: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleLine: {
        width: '60%',
        height: 24,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    subtitleLine: {
        width: '40%',
        height: 16,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    priceTagSkeleton: {
        width: 60,
        height: 30,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    subjectRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    metaRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    metaRowWeb: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        paddingVertical: spacing.xs,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.neutrals.surfaceAlt,
    },
    metaItem: {
        width: 80,
        height: 14,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    chip: {
        width: 100,
        height: 24,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    button: {
        width: 120,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    buttonSmall: {
        width: 80,
        height: 32,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
});

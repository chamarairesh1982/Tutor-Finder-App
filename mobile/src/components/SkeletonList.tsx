import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius, spacing } from '../lib/theme';

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
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
    card: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    content: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    infoCol: {
        flex: 1,
        gap: spacing.md,
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
    metaRow: {
        flexDirection: 'row',
        gap: spacing.md,
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
});

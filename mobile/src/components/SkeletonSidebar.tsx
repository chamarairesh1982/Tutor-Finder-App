import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius, spacing } from '../lib/theme';

export function SkeletonSidebar() {
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
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Animated.View style={[styles.title, { opacity }]} />
            </View>

            {/* Price section */}
            <Animated.View style={[styles.label, { opacity }]} />
            <Animated.View style={[styles.slider, { opacity }]} />

            {/* Rating section */}
            <Animated.View style={[styles.label, { opacity }]} />
            <View style={styles.ratingRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Animated.View key={i} style={[styles.star, { opacity }]} />
                ))}
            </View>

            {/* Distance section */}
            <Animated.View style={[styles.label, { opacity }]} />
            <Animated.View style={[styles.slider, { opacity }]} />

            {/* Quick picks section */}
            <Animated.View style={[styles.label, { opacity }]} />
            <View style={styles.chipRow}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Animated.View key={i} style={[styles.chip, { opacity }]} />
                ))}
            </View>

            {/* Teaching mode section */}
            <Animated.View style={[styles.label, { opacity }]} />
            <View style={styles.modeRow}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Animated.View key={i} style={[styles.modeButton, { opacity }]} />
                ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Animated.View style={[styles.mainButton, { opacity }]} />
                <Animated.View style={[styles.clearButton, { opacity }]} />
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
        borderColor: colors.neutrals.border,
        gap: spacing.lg,
    },
    headerRow: {
        marginBottom: spacing.xs,
    },
    title: {
        width: 100,
        height: 28,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    label: {
        width: 120,
        height: 12,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    slider: {
        width: '100%',
        height: 20,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    star: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        width: 70,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    modeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    modeButton: {
        flex: 1,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    footer: {
        marginTop: spacing.md,
        gap: spacing.md,
    },
    mainButton: {
        width: '100%',
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    clearButton: {
        width: 100,
        height: 16,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignSelf: 'center',
    },
});

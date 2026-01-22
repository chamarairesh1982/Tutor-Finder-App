import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay
} from 'react-native-reanimated';
import { colors, spacing } from '../lib/theme';

export function TypingIndicator() {
    return (
        <View style={styles.container}>
            <Dot delay={0} />
            <Dot delay={150} />
            <Dot delay={300} />
        </View>
    );
}

function Dot({ delay }: { delay: number }) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        scale.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1.4, { duration: 400 }),
                    withTiming(1, { duration: 400 })
                ),
                -1,
                true
            )
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 400 }),
                    withTiming(0.4, { duration: 400 })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.neutrals.textMuted,
    },
});

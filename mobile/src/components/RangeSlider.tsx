import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, useDerivedValue } from 'react-native-reanimated';
import { colors, spacing, typography } from '../lib/theme';

interface RangeSliderProps {
    min: number;
    max: number;
    initialMin: number;
    initialMax: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}

export function RangeSlider({ min, max, initialMin, initialMax, onMinChange, onMaxChange }: RangeSliderProps) {
    const sliderWidth = useSharedValue(0);
    const minX = useSharedValue(0);
    const maxX = useSharedValue(0);
    const isReady = useSharedValue(false);

    const onLayout = (event: any) => {
        const width = event.nativeEvent.layout.width - 24;
        sliderWidth.value = width;

        // Use relative positions based on initial values
        minX.value = ((initialMin - min) / (max - min)) * width;
        maxX.value = ((initialMax - min) / (max - min)) * width;
        isReady.value = true;
    };

    const minPan = Gesture.Pan()
        .onUpdate((event) => {
            let nextX = event.x;
            if (nextX < 0) nextX = 0;
            if (nextX > maxX.value - 10) nextX = maxX.value - 10;
            minX.value = nextX;

            const percent = nextX / sliderWidth.value;
            const val = min + percent * (max - min);
            runOnJS(onMinChange)(Math.round(val));
        });

    const maxPan = Gesture.Pan()
        .onUpdate((event) => {
            let nextX = event.x;
            if (nextX > sliderWidth.value) nextX = sliderWidth.value;
            if (nextX < minX.value + 10) nextX = minX.value + 10;
            maxX.value = nextX;

            const percent = nextX / sliderWidth.value;
            const val = min + percent * (max - min);
            runOnJS(onMaxChange)(Math.round(val));
        });

    const minThumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: minX.value }],
    }));

    const maxThumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: maxX.value }],
    }));

    const progressStyle = useAnimatedStyle(() => ({
        left: minX.value + 12,
        width: maxX.value - minX.value,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.trackContainer} onLayout={onLayout}>
                <View style={styles.track} />
                <Animated.View style={[styles.progress, progressStyle]} />

                <GestureDetector gesture={minPan}>
                    <Animated.View style={[styles.thumb, minThumbStyle]} />
                </GestureDetector>

                <GestureDetector gesture={maxPan}>
                    <Animated.View style={[styles.thumb, maxThumbStyle]} />
                </GestureDetector>
            </View>
            <View style={styles.labelRow}>
                <Text style={styles.label}>£{initialMin}</Text>
                <Text style={styles.label}>£{initialMax}+</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    trackContainer: {
        height: 4,
        width: '100%',
        justifyContent: 'center',
    },
    track: {
        height: 4,
        backgroundColor: colors.neutrals.border,
        borderRadius: 2,
        width: '100%',
    },
    progress: {
        position: 'absolute',
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    thumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: colors.primary,
        left: -12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
            web: {
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }
        }),
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
    },
    label: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
        fontWeight: '600',
    }
});

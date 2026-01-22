import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, useDerivedValue } from 'react-native-reanimated';
import { colors, borderRadius } from '../lib/theme';

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    labelSuffix?: string;
}

export function Slider({ min, max, value, onChange, labelSuffix = '' }: SliderProps) {
    const sliderWidth = useSharedValue(0);
    const translateX = useSharedValue(0);
    const isFirstLayout = useSharedValue(true);

    const onLayout = (event: any) => {
        const width = event.nativeEvent.layout.width - 24; // Thumb width offset
        sliderWidth.value = width;

        // Initialize thumb position based on value
        if (isFirstLayout.value) {
            const initialPos = ((value - min) / (max - min)) * width;
            translateX.value = initialPos;
            isFirstLayout.value = false;
        }
    };

    const pan = Gesture.Pan()
        .onUpdate((event) => {
            let nextX = event.x;
            if (nextX < 0) nextX = 0;
            if (nextX > sliderWidth.value) nextX = sliderWidth.value;
            translateX.value = nextX;

            const percent = nextX / sliderWidth.value;
            const rawValue = min + percent * (max - min);
            runOnJS(onChange)(Math.round(rawValue));
        });

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: translateX.value + 12,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.trackContainer} onLayout={onLayout}>
                <View style={styles.track} />
                <Animated.View style={[styles.progress, progressStyle]} />
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.thumb, thumbStyle]} />
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
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
});

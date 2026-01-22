import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors, borderRadius, spacing } from '../lib/theme';

interface ChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    color?: string; // Custom color for the text/border/bg
}

export function Chip({ label, selected, onPress, color = colors.primary }: ChipProps) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.container,
                selected ? { backgroundColor: color, borderColor: color } : styles.outlined,
                onPress && styles.pressable,
            ]}
        >
            <Text
                variant="caption"
                weight="medium"
                style={{
                    color: selected ? colors.neutrals.surface : colors.neutrals.textSecondary,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    outlined: {
        backgroundColor: 'transparent',
        borderColor: colors.neutrals.border,
    },
    pressable: {
        // Add interaction logic if needed
    }
});

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../lib/theme';
import { Text } from './Text';
import { TutorSearchResult } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface MapPanelProps {
    tutors: TutorSearchResult[];
    selectedId?: string;
    onMarkerPress?: (id: string) => void;
}

export function MapPanel({ tutors, selectedId, onMarkerPress }: MapPanelProps) {
    // This is a placeholder for real Map implementation (e.g. react-native-maps or maplibre)
    // It demonstrates the layout and marker simulation

    return (
        <View style={styles.container}>
            <View style={styles.placeholderBg}>
                <Ionicons name="map-outline" size={48} color={colors.neutrals.borderAlt} />
                <Spacer size="md" />
                <Text variant="bodySmall" color={colors.neutrals.textMuted} align="center">
                    Interactive Map View{"\n"}
                    (Connect Map Provider to activate)
                </Text>
            </View>

            {/* Simulated Markers */}
            <View style={styles.overlay}>
                {tutors.slice(0, 5).map((tutor, index) => (
                    <View
                        key={tutor.id}
                        style={[
                            styles.marker,
                            { top: 100 + index * 60, left: 100 + (index % 2) * 80 },
                            selectedId === tutor.id && styles.markerSelected
                        ]}
                    >
                        <Text variant="caption" weight="heavy" color={selectedId === tutor.id ? "#fff" : colors.primary}>
                            £{tutor.pricePerHour}
                        </Text>
                        <View style={[styles.markerArrow, selectedId === tutor.id && styles.markerArrowSelected]} />
                    </View>
                ))}
            </View>

            <View style={styles.legal}>
                <Text variant="caption" color={colors.neutrals.textMuted}>© OpenStreetMap contributors</Text>
            </View>
        </View>
    );
}

function Spacer({ size = 'md' }: { size?: keyof typeof spacing }) {
    return <View style={{ height: spacing[size] }} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        position: 'relative',
        overflow: 'hidden',
    },
    placeholderBg: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f3f5',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    marker: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#fff',
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primary,
        ...shadows.sm,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryDark,
        ...shadows.md,
        zIndex: 10,
    },
    markerArrow: {
        position: 'absolute',
        bottom: -6,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderLeftColor: 'transparent',
        borderRightWidth: 6,
        borderRightColor: 'transparent',
        borderTopWidth: 6,
        borderTopColor: '#fff',
    },
    markerArrowSelected: {
        borderTopColor: colors.primary,
    },
    legal: {
        position: 'absolute',
        bottom: 4,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 4,
        borderRadius: 2,
    }
});

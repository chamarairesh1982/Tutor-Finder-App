import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../lib/theme';
import { TutorSearchResult } from '../../types';

interface MapPanelPlaceholderProps {
    tutors: TutorSearchResult[];
    activeTutorId?: string;
}

export function MapPanelPlaceholder({ tutors, activeTutorId }: MapPanelPlaceholderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.mapVisualContainer}>
                <ImageBackground
                    source={require('../../../assets/map_placeholder.png')}
                    style={styles.mapBackground}
                    resizeMode="cover"
                >
                    {/* Simulated Pins - Aligned to map geography */}
                    {tutors.slice(0, 4).map((tutor, idx) => {
                        const positions: { top: any; left: any }[] = [
                            { top: '35%', left: '48%' }, // Higher central
                            { top: '55%', left: '42%' }, // Lower central
                            { top: '48%', left: '62%' }, // Right
                            { top: '22%', left: '25%' }, // Upper left
                        ];
                        const pos = positions[idx % positions.length];
                        const isActive = tutor.id === activeTutorId;

                        return (
                            <View key={tutor.id} style={[styles.mapPin, pos, isActive && styles.mapPinActive]}>
                                <View style={[styles.pinCore, isActive && styles.pinCoreActive]} />
                                {isActive && <View style={styles.pinPulse} />}
                                {isActive && (
                                    <View style={styles.pinLabel}>
                                        <Text style={styles.pinLabelText}>{tutor.fullName}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ImageBackground>

                <View style={styles.mapOverlay}>
                    <View style={styles.overlayBadge}>
                        <Text style={styles.overlayText}>Interactive Map Feature Coming Soon</Text>
                    </View>
                </View>
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
                                    {item.distanceMiles > 0
                                        ? `${item.distanceMiles.toFixed(1)} miles away`
                                        : 'Distance unavailable'} · {item.nextAvailableText}
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
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.lg,
        minHeight: 480,
    },
    mapVisualContainer: {
        height: 200,
        backgroundColor: '#f8fafc',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        marginBottom: spacing.xl,
        position: 'relative',
    },
    mapBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    mapPin: {
        position: 'absolute',
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapPinActive: {
        zIndex: 50,
    },
    pinCore: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: '#fff',
        ...shadows.sm,
    },
    pinCoreActive: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
        borderWidth: 3,
    },
    pinPulse: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        opacity: 0.2,
    },
    pinLabel: {
        position: 'absolute',
        bottom: '120%',
        backgroundColor: colors.neutrals.surface,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.md,
    },
    pinLabelText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        pointerEvents: 'none' as any,
    },
    overlayBadge: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    overlayText: {
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    listContent: {
        paddingBottom: spacing.sm,
    },
    pinRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
    },
    pinRowActive: {
        backgroundColor: colors.primarySoft,
    },
    pinDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.neutrals.textMuted,
        marginRight: spacing.lg,
    },
    pinDotActive: {
        backgroundColor: colors.primary,
    },
    pinTextWrapper: {
        flex: 1,
    },
    pinTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: 2,
    },
    pinMeta: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    separator: {
        height: 1,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
});

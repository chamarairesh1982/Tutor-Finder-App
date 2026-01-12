import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/theme';
import { TutorSearchResult, TeachingMode } from '../types';
import { Button } from './Button';

interface TutorCardWebProps {
    tutor: TutorSearchResult;
    onPress?: () => void;
    onRequestBooking?: () => void;
    onViewProfile?: () => void;
}

const modeLabel: Record<TeachingMode, string> = {
    [TeachingMode.InPerson]: 'In-person',
    [TeachingMode.Online]: 'Online',
    [TeachingMode.Both]: 'In-person & Online',
};

export function TutorCardWeb({ tutor, onPress, onRequestBooking, onViewProfile }: TutorCardWebProps) {
    const [isSaved, setIsSaved] = useState(false);
    const badges: string[] = [];
    if (tutor.hasDbs) badges.push('DBS verified');
    if (tutor.hasCertification) badges.push('Certified');
    if (tutor.badges?.length) badges.push(...tutor.badges);
    if (badges.length === 0) badges.push('Profile verified');

    const subjects = tutor.subjects.slice(0, 4);

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.accentBar} />
            <View style={styles.cardMain}>
                <View style={styles.avatarCol}>
                    <View style={styles.avatarWrapper}>
                        {tutor.photoUrl ? (
                            <Image source={{ uri: tutor.photoUrl }} style={styles.avatar} resizeMode="cover" />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarInitial}>{tutor.fullName.charAt(0)}</Text>
                            </View>
                        )}
                        <View style={styles.verifiedMini}><Text style={styles.verifiedMiniText}>✓</Text></View>
                    </View>
                    <View style={styles.badgeStack}>
                        {badges.slice(0, 2).map((badge) => (
                            <View key={badge} style={styles.badge}>
                                <Text style={styles.badgeText}>{badge}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.infoCol}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.name}>{tutor.fullName}</Text>
                            <View style={styles.ratingRow}>
                                <Text style={styles.ratingText}>★ {tutor.averageRating.toFixed(1)}</Text>
                                <Text style={styles.reviewCount}>({tutor.reviewCount} reviews)</Text>
                            </View>
                        </View>
                        <View style={styles.priceTag}>
                            <Text style={styles.price}>£{tutor.pricePerHour}</Text>
                            <Text style={styles.priceUnit}>/hr</Text>
                        </View>
                    </View>

                    <View style={styles.subjectRow}>
                        {subjects.map((subject) => (
                            <View key={subject} style={styles.subjectChip}>
                                <Text style={styles.subjectText}>{subject}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.metaRow}>
                        <MetaItem icon="📍" text={tutor.distanceMiles > 0 ? `${tutor.distanceMiles.toFixed(1)} mi away` : 'Distance shown when location is set'} />
                        <MetaItem icon="🕒" text={tutor.nextAvailableText || 'Next availability shared after enquiry'} />
                        <MetaItem icon="💬" text={tutor.responseTimeText || 'Typically responds fast'} />
                    </View>

                    <View style={styles.footerRow}>
                        <View style={styles.modeTag}>
                            <Text style={styles.modeTagText}>{modeLabel[tutor.teachingMode ?? TeachingMode.Both]}</Text>
                        </View>
                        <View style={styles.ctaButtons}>
                            <Button
                                title="View profile"
                                onPress={onViewProfile || onPress || (() => { })}
                                size="sm"
                                variant="outline"
                            />
                            <Button
                                title="Book Now"
                                onPress={onRequestBooking || onPress || (() => { })}
                                size="sm"
                            />
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.saveButton}
                onPress={(e) => {
                    e.stopPropagation();
                    setIsSaved(!isSaved);
                }}
            >
                <Text style={[styles.saveIcon, isSaved && styles.saveIconActive]}>{isSaved ? '♥' : '♡'}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

function MetaItem({ icon, text }: { icon: string; text: string }) {
    return (
        <View style={styles.metaItemRow}>
            <Text style={styles.metaIcon}>{icon}</Text>
            <Text style={styles.metaText} numberOfLines={1}>{text}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        overflow: 'hidden',
        position: 'relative',
        ...shadows.sm,
        ...Platform.select({
            web: {
                transition: 'all 150ms ease',
                cursor: 'pointer',
            } as any,
        }),
    },
    accentBar: {
        height: 6,
        backgroundColor: colors.primary,
        width: '100%',
    },
    cardMain: {
        flexDirection: 'row',
        padding: spacing.lg,
        gap: spacing.lg,
    },
    avatarCol: {
        width: 100,
        alignItems: 'center',
        gap: spacing.md,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: borderRadius.md,
    },
    avatarPlaceholder: {
        width: 88,
        height: 88,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.primary,
    },
    verifiedMini: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.neutrals.surface,
    },
    verifiedMiniText: {
        color: colors.neutrals.surface,
        fontSize: 10,
        fontWeight: 'bold',
    },
    badgeStack: {
        gap: spacing.xxs,
        width: '100%',
    },
    badge: {
        paddingVertical: 2,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
        alignSelf: 'center',
    },
    badgeText: {
        fontSize: 10,
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    infoCol: {
        flex: 1,
        gap: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingRight: spacing.xl, // Make room for save button
    },
    name: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: 2,
    },
    ratingText: {
        fontWeight: typography.fontWeight.bold,
        color: colors.ratingStars,
        fontSize: typography.fontSize.sm,
    },
    reviewCount: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.medium,
    },
    priceTag: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.heavy,
        color: colors.primaryDark,
    },
    priceUnit: {
        fontSize: 10,
        color: colors.neutrals.textMuted,
        marginTop: -4,
    },
    subjectRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    subjectChip: {
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
    },
    subjectText: {
        fontSize: 11,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.semibold,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        paddingVertical: spacing.xs,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    metaItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaIcon: {
        fontSize: 14,
    },
    metaText: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    modeTag: {
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(217, 70, 239, 0.08)',
    },
    modeTagText: {
        fontSize: 11,
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    saveButton: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surface,
        ...shadows.sm,
        zIndex: 10,
    },
    saveIcon: {
        fontSize: 20,
        color: colors.neutrals.textMuted,
    },
    saveIconActive: {
        color: colors.primary,
    },
});

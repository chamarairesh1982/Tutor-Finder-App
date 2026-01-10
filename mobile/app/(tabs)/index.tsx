import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeSearchBar } from '../../src/components';
import { colors, spacing, typography, borderRadius, layout, shadows } from '../../src/lib/theme';
import { useBreakpoint } from '../../src/lib/responsive';
import { TeachingMode } from '../../src/types';

const categoryCards = [
    { key: 'all', label: 'All Subjects', color: colors.categories.purple, emoji: '🎯' },
    { key: 'Music', label: 'Music', color: colors.categories.blue, emoji: '🎸' },
    { key: 'Sports', label: 'Sports', color: colors.categories.green, emoji: '⚽' },
    { key: 'Arts', label: 'Arts & Crafts', color: colors.categories.pink, emoji: '🎨' },
    { key: 'Academic', label: 'Academic', color: colors.categories.orange, emoji: '📚' },
    { key: 'Languages', label: 'Languages', color: colors.categories.indigo, emoji: '🗣️' },
];

export default function DiscoverScreen() {
    const router = useRouter();
    const { width } = useBreakpoint();

    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(10);
    const [mode, setMode] = useState<TeachingMode>(TeachingMode.Both);

    const handleSearch = () => {
        router.push({
            pathname: '/search',
            params: {
                subject,
                location,
                radius: radius.toString(),
                mode: mode.toString()
            }
        });
    };

    const handleCategorySelect = (key: string) => {
        router.push({
            pathname: '/search',
            params: { subject: key === 'All Subjects' ? '' : key }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                contentContainerStyle={[styles.page, { paddingHorizontal: width > layout.contentMaxWidth ? spacing.xl : spacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.navbar}>
                    <View style={styles.brandRow}>
                        <View style={styles.logo}><Text style={styles.logoText}>T</Text></View>
                        <View>
                            <Text style={styles.brand}>TutorMatch UK</Text>
                            <Text style={styles.brandSub}>Find Your Perfect Tutor</Text>
                        </View>
                    </View>
                    <View style={styles.navActions}>
                        <TouchableOpacity style={styles.navCta} onPress={() => router.push('/(auth)/register')}>
                            <Text style={styles.navCtaText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.heroCentered}>
                    <Text style={styles.heroTitle}>
                        Learn Something <Text style={styles.heroAmazing}>Amazing</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Connect with verified tutors across the UK for music, sports, academics, and more. Quality learning starts here.
                    </Text>

                    <View style={styles.searchContainer}>
                        <HomeSearchBar
                            subject={subject}
                            location={location}
                            radius={radius}
                            mode={mode}
                            onSubjectChange={setSubject}
                            onLocationChange={setLocation}
                            onRadiusChange={setRadius}
                            onModeChange={setMode}
                            onSubmit={handleSearch}
                        />
                    </View>

                    <View style={styles.trustBadges}>
                        <TrustBadge icon="🛡️" label="Verified Tutors" />
                        <TrustBadge icon="⭐" label="5000+ Reviews" />
                        <TrustBadge icon="📅" label="Easy Booking" />
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Browse by Category</Text>
                </View>
                <View style={styles.categoryGrid}>
                    {categoryCards.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[styles.categoryCard, { backgroundColor: cat.color }]}
                            onPress={() => handleCategorySelect(cat.label)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                            <Text style={styles.categoryLabel}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.statsBar}>
                    <View style={styles.statsItem}>
                        <Text style={styles.statsLabel}>8 tutors found</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
    return (
        <View style={styles.trustBadge}>
            <Text style={styles.trustBadgeIcon}>{icon}</Text>
            <Text style={styles.trustBadgeText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    page: {
        paddingVertical: spacing.xl,
        gap: spacing['2xl'],
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    logo: {
        width: 44,
        height: 44,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: colors.neutrals.surface,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.heavy,
    },
    brand: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
        letterSpacing: -0.5,
    },
    brandSub: {
        fontSize: 11,
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: typography.fontWeight.semibold,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    navCta: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.full,
    },
    navCtaText: {
        color: colors.neutrals.surface,
        fontWeight: typography.fontWeight.bold,
    },
    heroCentered: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
        gap: spacing.lg,
    },
    heroTitle: {
        fontSize: typography.fontSize['5xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        textAlign: 'center',
        letterSpacing: -1.5,
        lineHeight: 52,
    },
    heroAmazing: {
        color: colors.primary,
    },
    heroSubtitle: {
        fontSize: typography.fontSize.lg,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        maxWidth: 600,
        lineHeight: 28,
    },
    searchContainer: {
        width: '100%',
        maxWidth: 800,
        marginTop: spacing.md,
    },
    trustBadges: {
        flexDirection: 'row',
        gap: spacing.xl,
        marginTop: spacing.md,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    trustBadgeIcon: {
        fontSize: typography.fontSize.base,
    },
    trustBadgeText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    sectionHeader: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    categoryCard: {
        width: '32%',
        minWidth: 160,
        height: 120,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        ...shadows.sm,
        flexGrow: 1,
    },
    categoryEmoji: {
        fontSize: 32,
    },
    categoryLabel: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.surface,
        textAlign: 'center',
    },
    statsBar: {
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        borderRadius: borderRadius.md,
    },
    statsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statsLabel: {
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
});

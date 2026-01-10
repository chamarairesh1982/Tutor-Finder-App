import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeSearchBar, Button } from '../../src/components';
import { colors, spacing, typography, borderRadius, layout } from '../../src/lib/theme';
import { useBreakpoint } from '../../src/lib/responsive';
import { TeachingMode } from '../../src/types';

const categoryCards = [
    { key: 'Music', label: 'Music', accent: '#EEF2FF' },
    { key: 'Maths', label: 'Maths', accent: '#E0F2FE' },
    { key: 'English', label: 'English', accent: '#ECFEFF' },
    { key: 'Science', label: 'Science', accent: '#F0FDF4' },
    { key: 'Languages', label: 'Languages', accent: '#FFF7ED' },
    { key: 'Programming', label: 'Programming', accent: '#F5F3FF' },
];

const quickFilters = [
    { key: 'dbs', label: 'DBS checked' },
    { key: 'rating45', label: '4.5+ rating' },
    { key: 'weekends', label: 'Available weekends' },
    { key: 'midPrice', label: '£20–£40' },
];

export default function DiscoverScreen() {
    const router = useRouter();
    const { isLg, width } = useBreakpoint();

    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(10);
    const [mode, setMode] = useState<TeachingMode>(TeachingMode.Both);
    const [selectedQuick, setSelectedQuick] = useState<string[]>([]);

    const heroCopy = useMemo(() => ({
        title: 'Find trusted tutors for every milestone',
        subtitle: 'Premium UK tutors with DBS checks, verified reviews, and fast responses.',
    }), []);

    const handleSearch = () => {
        const params: Record<string, string> = {
            subject: subject,
            location: location,
            radius: String(radius),
            mode: String(mode),
        };
        if (selectedQuick.includes('rating45')) params.rating45 = '1';
        if (selectedQuick.includes('midPrice')) params.midPrice = '1';
        if (selectedQuick.includes('dbs')) params.dbs = '1';
        if (selectedQuick.includes('weekends')) params.weekends = '1';
        router.push({ pathname: '/search', params });
    };

    const handleCategorySelect = (key: string) => {
        if (key === 'all') {
            setSubject('');
            return;
        }
        setSubject(key);
    };

    const toggleQuick = (key: string) => {
        setSelectedQuick((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView contentContainerStyle={[styles.page, { paddingHorizontal: width > layout.contentMaxWidth ? spacing.xl : spacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.navbar}>
                    <Text style={styles.brand}>TutorFinder</Text>
                    <View style={styles.navActions}>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}><Text style={styles.navLink}>Login</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}><Text style={styles.navLink}>Sign up</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.navCta} onPress={() => router.push('/(auth)/register')}>
                            <Text style={styles.navCtaText}>Become a Tutor</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.hero, isLg && styles.heroRow]}>
                    <View style={styles.heroTextCol}>
                        <Text style={styles.heroTitle}>{heroCopy.title}</Text>
                        <Text style={styles.heroSubtitle}>{heroCopy.subtitle}</Text>
                        <View style={styles.heroBadges}>
                            <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>DBS awareness</Text></View>
                            <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>Responsive tutors</Text></View>
                            <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>Safe payments</Text></View>
                        </View>
                    </View>
                    <View style={styles.heroCard}>
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
                        <View style={styles.quickRow}>
                            {quickFilters.map((chip) => {
                                const isActive = selectedQuick.includes(chip.key);
                                return (
                                    <TouchableOpacity
                                        key={chip.key}
                                        style={[styles.quickChip, isActive && styles.quickChipActive]}
                                        onPress={() => toggleQuick(chip.key)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.quickChipText, isActive && styles.quickChipTextActive]}>{chip.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Browse by category</Text>
                    <Text style={styles.sectionSubtitle}>Compact, colourful tiles that stay tidy on desktop</Text>
                </View>
                <View style={styles.categoryGrid}>
                    <TouchableOpacity style={[styles.categoryCard, styles.allCard]} onPress={() => handleCategorySelect('all')} activeOpacity={0.9}>
                        <Text style={styles.categoryLabel}>All subjects</Text>
                        <Text style={styles.categoryHint}>Reset selection</Text>
                    </TouchableOpacity>
                    {categoryCards.map((cat) => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[styles.categoryCard, { backgroundColor: cat.accent }]}
                            onPress={() => handleCategorySelect(cat.label)}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.categoryLabel}>{cat.label}</Text>
                            <Text style={styles.categoryHint}>Highly rated tutors</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Why learners trust us</Text>
                </View>
                <View style={[styles.trustRow, isLg && styles.trustRowWide]}>
                    <TrustCard title="Verified profiles" subtitle="Tutor bios, pricing, and reviews presented on clean white cards." />
                    <TrustCard title="Web-first layouts" subtitle="Sticky filters and split map views keep context on large screens." />
                    <TrustCard title="Fast booking" subtitle="Bold CTAs and responsive focus states across devices." />
                </View>

                <Button title="Find tutors now" onPress={handleSearch} fullWidth={false} />
            </ScrollView>
        </SafeAreaView>
    );
}

function TrustCard({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <View style={trustStyles.card}>
            <Text style={trustStyles.title}>{title}</Text>
            <Text style={trustStyles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    page: {
        paddingVertical: spacing['2xl'],
        gap: spacing.lg,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.primary,
        letterSpacing: -0.5,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    navLink: {
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    navCta: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
    },
    navCtaText: {
        color: colors.neutrals.surface,
        fontWeight: typography.fontWeight.bold,
    },
    hero: {
        gap: spacing.lg,
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroTextCol: {
        flex: 1,
        gap: spacing.md,
    },
    heroTitle: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    heroSubtitle: {
        fontSize: typography.fontSize.lg,
        color: colors.neutrals.textSecondary,
        lineHeight: 26,
    },
    heroBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    heroBadge: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    heroBadgeText: {
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    heroCard: {
        flex: 1,
        gap: spacing.md,
    },
    quickRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    quickChip: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...Platform.select({ web: { cursor: 'pointer' } }),
    },
    quickChipActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    quickChipText: {
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    quickChipTextActive: {
        color: colors.primaryDark,
    },
    sectionHeader: {
        gap: spacing.xs,
    },
    sectionTitle: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    categoryCard: {
        width: '48%',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    allCard: {
        backgroundColor: colors.neutrals.surface,
    },
    categoryLabel: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    categoryHint: {
        color: colors.neutrals.textSecondary,
        marginTop: spacing.xs,
    },
    trustRow: {
        gap: spacing.md,
    },
    trustRowWide: {
        flexDirection: 'row',
    },
});

const trustStyles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        color: colors.neutrals.textSecondary,
        lineHeight: 22,
    },
});

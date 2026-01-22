import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeSearchBar, Text, Card, ErrorState, EmptyState, SkeletonList } from '../../src/components';
import { colors, spacing, typography, borderRadius, layout, shadows } from '../../src/lib/theme';
import { useBreakpoint } from '../../src/lib/responsive';
import { TeachingMode } from '../../src/types';
import { useAuthStore } from '../../src/store/authStore';
import { useSearchTutors } from '../../src/hooks/useTutors';
import { TutorCard } from '../../src/components/TutorCard';

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
    const { isAuthenticated } = useAuthStore();
    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(10);
    const [mode, setMode] = useState<TeachingMode>(TeachingMode.Both);
    const [availabilityDay, setAvailabilityDay] = useState<number | undefined>(undefined);

    const {
        data: featuredData,
        isLoading: isLoadingFeatured,
        isError: isFeaturedError,
        refetch: refetchFeatured
    } = useSearchTutors({
        lat: undefined, lng: undefined, postcode: undefined, radiusMiles: 50,
        subject: undefined, category: undefined, minRating: 4,
        priceMin: undefined, priceMax: undefined, mode: undefined,
        page: 1, pageSize: 4, sortBy: 'rating'
    });

    const featuredTutors = featuredData?.items ?? [];

    const handleSearch = () => {
        router.push({
            pathname: '/search',
            params: {
                subject,
                location,
                radius: radius.toString(),
                mode: mode.toString(),
                availabilityDay: availabilityDay !== undefined ? availabilityDay.toString() : undefined
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
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView
                contentContainerStyle={[
                    styles.page,
                    { paddingHorizontal: width > layout.contentMaxWidth ? spacing.xl : spacing.lg }
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoadingFeatured} onRefresh={refetchFeatured} />
                }
            >
                {/* Navbar */}
                <View style={styles.navbar}>
                    <View style={styles.brandRow}>
                        <View style={styles.logo}><Text style={styles.logoText}>T</Text></View>
                        <View style={{ justifyContent: 'center' }}>
                            <Text variant="h5" style={{ color: colors.primaryDark, marginBottom: 0 }}>TutorMatch UK</Text>
                            <Text variant="caption" style={styles.brandSub}>Find Your Perfect Tutor</Text>
                        </View>
                    </View>
                    <View style={styles.navActions}>
                        {isAuthenticated ? (
                            <TouchableOpacity style={styles.navCta} onPress={() => router.push('/profile')}>
                                <Text style={styles.navCtaText}>My Profile</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                    <Text style={styles.navLink}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.navCta} onPress={() => router.push('/(auth)/register')}>
                                    <Text style={styles.navCtaText}>Sign Up</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroCentered}>
                    <Text variant="h1" align="center" style={styles.heroTitle}>
                        Learn Something <Text style={styles.heroAmazing}>Amazing</Text>
                    </Text>
                    <Text variant="bodyLarge" align="center" style={styles.heroSubtitle}>
                        Connect with verified tutors across the UK for music, sports, academics, and more. Quality learning starts here.
                    </Text>

                    <View style={styles.searchContainer}>
                        <HomeSearchBar
                            subject={subject}
                            location={location}
                            radius={radius}
                            mode={mode}
                            availabilityDay={availabilityDay}
                            onSubjectChange={setSubject}
                            onLocationChange={setLocation}
                            onRadiusChange={setRadius}
                            onModeChange={setMode}
                            onAvailabilityDayChange={setAvailabilityDay}
                            onSubmit={handleSearch}
                        />
                    </View>

                    <View style={styles.trustBadges}>
                        <TrustBadge icon="🛡️" label="Verified Tutors" />
                        <TrustBadge icon="⭐" label="5000+ Reviews" />
                        <TrustBadge icon="📅" label="Easy Booking" />
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text variant="h4">Browse by Category</Text>
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
                            <Text weight="bold" style={styles.categoryLabel}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Featured Section */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Text variant="h4">Featured Tutors</Text>
                        <TouchableOpacity onPress={() => router.push('/search')}>
                            <Text style={styles.viewAllText}>View all →</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isLoadingFeatured ? (
                    <SkeletonList count={3} />
                ) : isFeaturedError ? (
                    <ErrorState
                        message="Failed to load featured tutors."
                        onRetry={refetchFeatured}
                    />
                ) : featuredTutors.length === 0 ? (
                    <EmptyState
                        title="No Featured Tutors"
                        message="Check back later for top-rated tutors."
                        icon="people-outline"
                    />
                ) : (
                    <View style={styles.featuredGrid}>
                        {featuredTutors.map((tutor) => (
                            <View key={tutor.id} style={styles.featuredCardWrapper}>
                                <TutorCard tutor={tutor} onPress={() => router.push(`/tutor/${tutor.id}`)} />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function TrustBadge({ icon, label }: { icon: string; label: string }) {
    return (
        <View style={styles.trustBadge}>
            <Text style={{ fontSize: 16 }}>{icon}</Text>
            <Text variant="caption" weight="medium" style={{ color: colors.neutrals.textSecondary }}>{label}</Text>
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
        gap: spacing.xl, // Reduced gap slightly
        paddingBottom: spacing['4xl'],
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        // Removed flex: 1 to prevent collapse
    },
    logo: {
        width: 44,
        height: 44,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0, // Prevent logo from squishing
    },
    logoText: {
        color: colors.neutrals.surface,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.heavy,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },
    brandSub: {
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flexShrink: 0, // Prevent actions from shrinking
        marginLeft: spacing.md,
    },
    navLink: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.semibold,
        marginRight: spacing.md,
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
        maxWidth: 900,
        marginBottom: spacing.xs,
        fontSize: Platform.OS === 'web' ? 48 : 32, // Responsive font size
        lineHeight: Platform.OS === 'web' ? 56 : 40,
    },
    heroAmazing: {
        color: colors.primary,
        fontStyle: 'italic',
        fontWeight: '800',
    },
    heroSubtitle: {
        color: colors.neutrals.textSecondary,
        maxWidth: 600,
        fontSize: Platform.OS === 'web' ? 18 : 16,
        lineHeight: 28, // Explicit line height to prevent overlap
    },
    searchContainer: {
        width: '100%',
        maxWidth: 800,
        marginTop: spacing.lg,
        zIndex: 100, // Higher z-index for dropdowns
        ...Platform.select({
            web: {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            }
        }),
    },
    trustBadges: {
        flexDirection: 'row',
        gap: spacing['2xl'],
        marginTop: spacing.xl,
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: 0.8,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    sectionHeader: {
        marginTop: spacing.md,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    viewAllText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.sm,
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
        ...shadows.sm,
        flexGrow: 1,
    },
    categoryEmoji: {
        fontSize: 32,
        marginBottom: spacing.xs,
    },
    categoryLabel: {
        color: colors.neutrals.surface,
        textAlign: 'center',
        zIndex: 1,
    },
    featuredGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.md,
    },
    featuredCardWrapper: {
        width: Platform.OS === 'web' ? '50%' : '100%',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
});

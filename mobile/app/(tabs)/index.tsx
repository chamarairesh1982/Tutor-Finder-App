import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    const { width, isLg } = useBreakpoint();
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
        <View style={styles.safeArea}>
            {isLg ? (
                <View style={styles.desktopNav}>
                    <View style={styles.desktopNavInner}>
                        <TouchableOpacity onPress={() => router.push('/')} style={styles.brandRow}>
                            <View style={styles.logoMini}><Text style={styles.logoMiniText}>T</Text></View>
                            <Text style={styles.brandTitleDesktop}>TutorMatch UK</Text>
                        </TouchableOpacity>
                        <View style={styles.desktopActions}>
                            {isAuthenticated ? (
                                <TouchableOpacity style={styles.navLink} onPress={() => router.push('/profile')}>
                                    <Text style={styles.navLinkText}>My Dashboard</Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.navLink} onPress={() => router.push('/(auth)/login')}>
                                        <Text style={styles.navLinkText}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.navCtaDesktop} onPress={() => router.push('/(auth)/register')}>
                                        <Text style={styles.navCtaTextDesktop}>Get Started</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.mobileNav}>
                    <SafeAreaView edges={['top']}>
                        <View style={styles.navContent}>
                            <View style={styles.brandRow}>
                                <View style={styles.logoMini}><Text style={styles.logoMiniText}>T</Text></View>
                                <Text style={styles.brandTitle}>TutorMatch</Text>
                            </View>
                            <View style={styles.navActions}>
                                {isAuthenticated ? (
                                    <TouchableOpacity style={styles.profileCircle} onPress={() => router.push('/profile')}>
                                        <Ionicons name="person" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.loginBtnSmall} onPress={() => router.push('/(auth)/login')}>
                                        <Text style={styles.loginBtnText}>Log In</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            )}

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

                {/* Hero Section */}
                <View style={[styles.heroSection, isLg && styles.heroSectionDesktop]}>
                    <View style={styles.heroHeader}>
                        <Text style={styles.heroPreTitle}>FIND YOUR PERFECT MATCH</Text>
                        <Text style={[styles.heroMainTitle, isLg && styles.heroMainTitleDesktop]}>
                            Learn Something <Text style={styles.heroHighlight}>Amazing</Text>
                        </Text>
                        <Text style={[styles.heroDesc, isLg && styles.heroDescDesktop]}>
                            Connect with verified experts for music, academics, languages and more. Quality learning starts here.
                        </Text>
                    </View>

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

                <View style={styles.sectionHeader}>
                    <Text variant="h4" style={isLg && { fontSize: 24 }}>What would you like to learn?</Text>
                </View>

                {isLg ? (
                    <View style={styles.categoryGrid}>
                        {categoryCards.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                style={[styles.categoryCardDesktop, { backgroundColor: cat.color + '15', borderColor: cat.color + '30' }]}
                                onPress={() => handleCategorySelect(cat.label)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.categoryEmojiBg, { backgroundColor: cat.color, width: 44, height: 44 }]}>
                                    <Text style={[styles.categoryEmoji, { fontSize: 22 }]}>{cat.emoji}</Text>
                                </View>
                                <Text weight="bold" style={[styles.categoryLabel, { color: cat.color, fontSize: 14 }]}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScroll}
                    >
                        {categoryCards.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                style={[styles.categoryCard, { backgroundColor: cat.color + '15', borderColor: cat.color + '30' }]}
                                onPress={() => handleCategorySelect(cat.label)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.categoryEmojiBg, { backgroundColor: cat.color }]}>
                                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                                </View>
                                <Text weight="bold" style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

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
                    <View style={[styles.featuredGrid, isLg && styles.featuredGridDesktop]}>
                        {featuredTutors.map((tutor) => (
                            <View key={tutor.id} style={[styles.featuredCardWrapper, isLg && styles.featuredCardWrapperDesktop]}>
                                <TutorCard tutor={tutor} onPress={() => router.push(`/tutor/${tutor.id}`)} />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
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
        paddingBottom: spacing['4xl'],
    },
    desktopNav: {
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
        zIndex: 2000,
        height: 80,
        justifyContent: 'center',
    },
    desktopNavInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        maxWidth: layout.wideContentMaxWidth,
        width: '100%',
        alignSelf: 'center',
    },
    brandTitleDesktop: {
        fontSize: 24,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    desktopActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
    },
    navLink: {
        paddingVertical: spacing.sm,
    },
    navLinkText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.neutrals.textSecondary,
    },
    navCtaDesktop: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        ...shadows.sm,
    },
    navCtaTextDesktop: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    mobileNav: {
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
        zIndex: 2000,
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        height: 60,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    logoMini: {
        width: 32,
        height: 32,
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoMiniText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    brandTitle: {
        fontSize: 20,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    loginBtnSmall: {
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary,
    },
    loginBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    heroSection: {
        paddingVertical: spacing.xl,
        gap: spacing.xl,
    },
    heroSectionDesktop: {
        paddingVertical: spacing['5xl'],
        gap: spacing['2xl'],
    },
    heroHeader: {
        alignItems: 'center',
        gap: 8,
    },
    heroPreTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primaryDark,
        letterSpacing: 2,
    },
    heroMainTitle: {
        fontSize: 36,
        fontWeight: typography.fontWeight.heavy,
        textAlign: 'center',
        color: colors.neutrals.textPrimary,
        lineHeight: 44,
    },
    heroMainTitleDesktop: {
        fontSize: 64,
        lineHeight: 72,
        maxWidth: 800,
    },
    heroHighlight: {
        color: colors.primary,
    },
    heroDesc: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: spacing.xl,
    },
    heroDescDesktop: {
        fontSize: 20,
        lineHeight: 32,
        maxWidth: 700,
    },
    searchContainer: {
        width: '100%',
        maxWidth: 800,
        zIndex: 500,
        alignSelf: 'center',
    },
    trustBadges: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginTop: spacing.md,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.neutrals.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    sectionHeader: {
        marginTop: spacing.xl,
        marginBottom: spacing.md,
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
    categoryScroll: {
        paddingRight: spacing.xl,
        gap: spacing.md,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    categoryCard: {
        width: 120,
        height: 140,
        borderRadius: 24,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        ...shadows.sm,
    },
    categoryCardDesktop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        gap: spacing.md,
        flex: 1,
        minWidth: 200,
    },
    categoryEmojiBg: {
        width: 54,
        height: 54,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
        ...shadows.sm,
    },
    categoryEmoji: {
        fontSize: 28,
    },
    categoryLabel: {
        fontSize: 13,
        textAlign: 'center',
    },
    featuredGrid: {
        marginHorizontal: -spacing.sm,
    },
    featuredGridDesktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.md,
    },
    featuredCardWrapper: {
        paddingVertical: spacing.xs,
    },
    featuredCardWrapperDesktop: {
        width: '50%',
        padding: spacing.md,
    },
});

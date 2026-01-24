import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl, Platform, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    HomeSearchBar, Text, Card, ErrorState,
    SkeletonList, TutorCardWeb, TutorCard, Screen, Container, Section, Spacer
} from '../../src/components';
import { colors, spacing, layout, shadows, borderRadius, typography } from '../../src/lib/theme';
import { useBreakpoint } from '../../src/lib/responsive';
import { TeachingMode } from '../../src/types';
import { useSearchTutors } from '../../src/hooks/useTutors';

const categoryCards = [
    { key: 'Music', label: 'Music', color: '#8B5CF6', icon: 'musical-notes' },
    { key: 'Maths', label: 'Maths', color: '#EC4899', icon: 'calculator' },
    { key: 'Science', label: 'Science', color: '#10B981', icon: 'flask' },
    { key: 'Languages', label: 'Languages', color: '#3B82F6', icon: 'language' },
    { key: 'Programming', label: 'Programming', color: '#6366F1', icon: 'code-slash' },
    { key: 'Academic', label: 'Academic', color: '#F59E0B', icon: 'school' },
    { key: 'Arts', label: 'Arts & Crafts', color: '#EF4444', icon: 'brush' },
    { key: 'Sports', label: 'Sports', color: '#22C55E', icon: 'fitness' },
    { key: 'Yoga', label: 'Yoga & Fitness', color: '#8B5CF6', icon: 'leaf' },
    { key: 'Business', label: 'Business', color: '#64748B', icon: 'stats-chart' },
];

export default function DiscoverScreen() {
    const router = useRouter();
    const { isLg } = useBreakpoint();
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
        radiusMiles: 50,
        minRating: 4,
        page: 1, pageSize: 8, sortBy: 'rating'
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
            params: { subject: key }
        });
    };

    return (
        <Screen
            scrollable
            backgroundColor={colors.neutrals.background}
            refreshControl={<RefreshControl refreshing={isLoadingFeatured} onRefresh={refetchFeatured} tintColor={colors.primary} />}
        >
            {/* World Class Hero Section */}
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000' }} // Premium education bg
                style={[styles.hero, isLg && styles.heroWeb]}
                imageStyle={{ opacity: 0.05 }}
            >
                <Container padding="lg">
                    <Section paddingVertical={isLg ? "5xl" : "3xl"} style={styles.heroInner}>
                        <View style={styles.heroText}>
                            <View style={styles.badgeWrapper}>
                                <Text variant="label" color={colors.primary} weight="heavy" style={styles.heroLabel}>
                                    UK Tutoring Marketplace
                                </Text>
                            </View>
                            <Spacer size="md" />
                            <Text variant="h1" weight="heavy" style={[styles.heroTitle, isLg && styles.heroTitleWeb]}>
                                Find the Right{"\n"}
                                <Text variant="h1" color={colors.primary} weight="heavy">Tutor</Text> for You
                            </Text>
                            <Spacer size="lg" />
                            <Text variant="bodyLarge" color={colors.neutrals.textSecondary} style={styles.heroSubtitle}>
                                Connect with qualified tutors near you. Browse profiles, read reviews, and book lessons online or in-person.
                            </Text>
                        </View>

                        <View style={[styles.searchContainer, isLg && styles.searchContainerWeb]}>
                            <Card variant="elevated" style={styles.searchCard}>
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
                            </Card>
                        </View>
                    </Section>
                </Container>
            </ImageBackground>

            {/* Main Content */}
            <Container padding="lg">
                {/* Categories */}
                <Section paddingVertical="2xl">
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text variant="h3" weight="heavy">Expertise by Subject</Text>
                            <Text variant="bodySmall" color={colors.neutrals.textMuted}>Find specialized support for any discipline.</Text>
                        </View>
                    </View>
                    <Spacer size="xl" />
                    <View style={styles.categoryGrid}>
                        {categoryCards.map((cat) => (
                            <TouchableOpacity
                                key={cat.key}
                                style={[styles.categoryBtn, isLg ? styles.categoryBtnWeb : styles.categoryBtnMobile]}
                                onPress={() => handleCategorySelect(cat.label)}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.categoryInner, { borderColor: cat.color + '20' }]}>
                                    <View style={[styles.iconBox, { backgroundColor: cat.color + '10' }]}>
                                        <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                                    </View>
                                    <Spacer size="sm" />
                                    <Text variant="bodySmall" weight="heavy" color={colors.neutrals.textPrimary}>{cat.label}</Text>
                                    <Text variant="caption" color={colors.neutrals.textMuted} style={{ fontSize: 10 }}>120+ Tutors</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Section>

                {/* Featured Tutors - Horizontal Scroll on Mobile, Grid on Web */}
                <Section paddingVertical="2xl">
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text variant="h2" weight="heavy">Featured Tutors</Text>
                            <Text variant="bodySmall" color={colors.neutrals.textMuted}>Highly-rated tutors in your area.</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/search')} style={styles.viewLink}>
                            <Text variant="bodySmall" color={colors.primary} weight="heavy">Browse All</Text>
                            <Ionicons name="arrow-forward" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                    <Spacer size="xl" />

                    {isLoadingFeatured ? (
                        <SkeletonList count={isLg ? 4 : 2} variant={isLg ? 'web' : 'mobile'} />
                    ) : isFeaturedError ? (
                        <ErrorState onRetry={refetchFeatured} />
                    ) : (
                        <View style={styles.tutorGrid}>
                            {featuredTutors.map((tutor) => (
                                <View key={tutor.id} style={isLg ? styles.tutorBoxWeb : styles.tutorBoxMobile}>
                                    {isLg ? (
                                        <TutorCardWeb tutor={tutor} onPress={() => router.push(`/tutor/${tutor.id}`)} />
                                    ) : (
                                        <TutorCard tutor={tutor} onPress={() => router.push(`/tutor/${tutor.id}`)} />
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </Section>
            </Container>
            <Spacer size="4xl" />
        </Screen>
    );
}

const styles = StyleSheet.create({
    hero: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    heroWeb: {
        minHeight: 600,
        justifyContent: 'center',
    },
    heroInner: {
        alignItems: 'center',
    },
    heroText: {
        alignItems: 'center',
        maxWidth: 800,
        marginBottom: spacing['3xl'],
    },
    badgeWrapper: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    heroLabel: {
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    heroTitle: {
        textAlign: 'center',
        lineHeight: 48,
        letterSpacing: -0.5,
    },
    heroTitleWeb: {
        fontSize: 64,
        lineHeight: 72,
    },
    heroSubtitle: {
        textAlign: 'center',
        maxWidth: 650,
        lineHeight: 28,
        fontSize: 18,
    },
    searchContainer: {
        width: '100%',
        maxWidth: 900,
        zIndex: 10,
    },
    searchContainerWeb: {
        maxWidth: 960,
    },
    searchCard: {
        padding: spacing.sm,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.floating,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    viewLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.sm,
    },
    categoryBtn: {
        padding: spacing.sm,
    },
    categoryBtnMobile: {
        width: '50%',
    },
    categoryBtnWeb: {
        width: '20%',
    },
    categoryInner: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 20,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.sm,
        ...Platform.select({
            web: {
                transition: 'all 0.3s ease',
                ':hover': {
                    transform: [{ translateY: -4 }],
                    borderColor: colors.primary,
                    ...shadows.md,
                }
            } as any
        })
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    tutorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.sm,
    },
    tutorBoxMobile: {
        width: '100%',
        padding: spacing.sm,
    },
    tutorBoxWeb: {
        width: '50%',
        padding: spacing.md,
    },
});

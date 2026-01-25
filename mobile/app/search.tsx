import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Platform, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    FilterSidebar, TutorCard, TutorCardWeb, HomeSearchBar,
    SkeletonList, ErrorState, Text, Screen, Container, Spacer, IconButton, EmptyState, MapPanel
} from '../src/components';
import { colors, spacing, layout, shadows, borderRadius, typography } from '../src/lib/theme';
import { useBreakpoint } from '../src/lib/responsive';
import { useSearchTutors } from '../src/hooks/useTutors';
import { SearchFiltersState } from '../src/components/FilterSidebar';
import { TeachingMode, TutorSearchRequest, TutorSearchResult } from '../src/types';
import { Ionicons } from '@expo/vector-icons';

export default function SearchPage() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        subject?: string; location?: string; radius?: string; mode?: string;
        rating45?: string; midPrice?: string; dbs?: string; weekends?: string;
        availabilityDay?: string;
    }>();
    const { isLg } = useBreakpoint();

    // Search State
    const [subject, setSubject] = useState(params.subject ?? '');
    const [location, setLocation] = useState(params.location ?? '');
    const [sortBy, setSortBy] = useState<TutorSearchRequest['sortBy']>('best');
    const [filters, setFilters] = useState<SearchFiltersState>({
        radiusMiles: params.radius ? Number(params.radius) : 25,
        mode: params.mode ? Number(params.mode) as TeachingMode : undefined,
        availabilityDay: params.availabilityDay ? Number(params.availabilityDay) : undefined,
        quickFilters: {
            dbs: params.dbs === '1',
            weekends: params.weekends === '1',
            rating45: params.rating45 === '1',
            midPrice: params.midPrice === '1',
        },
    });

    // UI State
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [allResults, setAllResults] = useState<TutorSearchResult[]>([]);

    const scrollViewRef = useRef<ScrollView>(null);

    const searchParams = useMemo<TutorSearchRequest>(() => ({
        subject: subject || undefined,
        postcode: location || undefined,
        radiusMiles: filters.radiusMiles,
        mode: filters.mode,
        minRating: filters.minRating,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        availabilityDay: filters.availabilityDay,
        page,
        pageSize: 20,
        sortBy,
    }), [subject, location, filters, sortBy, page]);

    const { data: tutorsPage, isLoading, isError, refetch, isFetching } = useSearchTutors(searchParams);

    const results = allResults;
    const totalCount = tutorsPage?.total ?? 0;
    const hasMore = tutorsPage ? results.length < tutorsPage.total : false;

    useEffect(() => {
        setPage(1);
        setAllResults([]);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
    }, [subject, location, filters, sortBy]);

    useEffect(() => {
        if (!tutorsPage) return;
        setAllResults((prev) => {
            if (searchParams.page === 1) return tutorsPage.items ?? [];
            const incoming = tutorsPage.items ?? [];
            const existingIds = new Set(prev.map((p) => p.id));
            const merged = [...prev, ...incoming.filter((i) => !existingIds.has(i.id))];
            return merged;
        });
    }, [tutorsPage, searchParams.page]);

    const handleLoadMore = () => {
        if (!hasMore || isFetching || isLoading) return;
        setPage((p) => p + 1);
    };

    const handleScroll = ({ nativeEvent }: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 400) {
            handleLoadMore();
        }
    };

    return (
        <Screen safe={false} backgroundColor={colors.neutrals.surface}>
            {/* World Class Search Header */}
            <View style={styles.header}>
                <Container maxWidth={layout.wideContentMaxWidth} fluid padding="lg">
                    <View style={styles.headerInner}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={colors.neutrals.textPrimary} />
                        </TouchableOpacity>
                        <View style={styles.searchWrapper}>
                            <HomeSearchBar
                                subject={subject}
                                location={location}
                                radius={filters.radiusMiles}
                                mode={filters.mode}
                                onSubjectChange={setSubject}
                                onLocationChange={setLocation}
                                onRadiusChange={(val) => setFilters({ ...filters, radiusMiles: val })}
                                onModeChange={(val) => setFilters({ ...filters, mode: val })}
                                onSubmit={refetch}
                                compact
                            />
                        </View>
                        {!isLg && (
                            <TouchableOpacity style={styles.mobileFilterToggle} onPress={() => setFiltersOpen(true)}>
                                <Ionicons name="options-outline" size={20} color={colors.neutrals.textPrimary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </Container>
            </View>

            {/* 3-Column Layout Area */}
            <View style={styles.layout}>
                {/* Column 1: Filters (Lg Only) */}
                {isLg && (
                    <View style={styles.sidebarWrapper}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <FilterSidebar
                                filters={filters}
                                onChange={setFilters}
                                onClose={() => { }}
                                compact
                            />
                        </ScrollView>
                    </View>
                )}

                {/* Column 2: Results Stream */}
                <View style={[styles.resultsWrapper, (isLg || viewMode === 'list') ? styles.visible : styles.hidden]}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.resultsScroll}
                        contentContainerStyle={styles.scrollContent}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading && results.length > 0}
                                onRefresh={refetch}
                                tintColor={colors.primary}
                            />
                        }
                    >
                        <Container padding="lg" fluid>
                            <View style={styles.resultsHeader}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.countBadge}>
                                        <Text variant="label" color={colors.primary} weight="heavy">
                                            {totalCount} EXPERTS FOUND
                                        </Text>
                                    </View>
                                    <Text variant="h2" weight="heavy" style={{ marginTop: spacing.sm }}>
                                        {subject || 'All Tutors'} {location ? `in ${location}` : 'Near You'}
                                    </Text>
                                    <Text variant="caption" color={colors.neutrals.textMuted}>
                                        Sorted by {sortLabel(sortBy)}
                                    </Text>
                                </View>

                                <View style={styles.headerActions}>
                                    {!isLg && (
                                        <TouchableOpacity style={styles.mobileFilterBtn} onPress={() => setFiltersOpen(true)}>
                                            <View style={styles.filterBadge}>
                                                <Ionicons name="options-outline" size={20} color={colors.primary} />
                                                <Text weight="bold" color={colors.primary} style={{ marginLeft: 6 }}>Filters</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={styles.sortToggle} onPress={() => setSortOpen(true)}>
                                        <View style={styles.sortPill}>
                                            <Ionicons name="swap-vertical" size={16} color={colors.primary} />
                                            <Text variant="bodySmall" weight="bold" color={colors.primary} style={{ marginLeft: 6 }}>Sort</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Spacer size="lg" />

                            <View style={styles.resultsGrid}>
                                {isLoading && results.length === 0 ? (
                                    <SkeletonList count={6} variant={isLg ? 'web' : 'mobile'} />
                                ) : isError ? (
                                    <ErrorState onRetry={refetch} />
                                ) : results.length === 0 ? (
                                    <EmptyState
                                        title="No tutors found in this area"
                                        message="Try broadening your subject or increasing the search radius."
                                        icon="search-outline"
                                    />
                                ) : (
                                    results.map((t) => (
                                        <View key={t.id} style={styles.cardWrapper}>
                                            {isLg ? (
                                                <TutorCardWeb tutor={t} onPress={() => router.push(`/tutor/${t.id}`)} />
                                            ) : (
                                                <TutorCard tutor={t} onPress={() => router.push(`/tutor/${t.id}`)} />
                                            )}
                                        </View>
                                    ))
                                )}
                            </View>

                            {isFetching && hasMore && (
                                <View style={styles.loaderBox}>
                                    <ActivityIndicator color={colors.primary} size="large" />
                                    <Text variant="caption" color={colors.neutrals.textMuted} style={{ marginTop: 8 }}>Loading more tutors...</Text>
                                </View>
                            )}
                            <Spacer size="5xl" />
                        </Container>
                    </ScrollView>
                </View>

                {/* Column 3: Map View (Lg Only) */}
                {isLg && (
                    <View style={styles.mapWrapperWeb}>
                        <MapPanel tutors={results} />
                    </View>
                )}
            </View>

            {/* Mobile Map Overlay View */}
            {!isLg && viewMode === 'map' && (
                <View style={styles.mapWrapperMobile}>
                    <MapPanel tutors={results} />
                </View>
            )}

            {/* Mobile Sticky Toggle */}
            {!isLg && (
                <View style={styles.mobileActions}>
                    <TouchableOpacity
                        style={styles.toggleBtn}
                        onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                        activeOpacity={0.9}
                    >
                        <Ionicons name={viewMode === 'list' ? 'map' : 'list'} size={20} color="#fff" />
                        <Text weight="heavy" color="#fff" style={{ marginLeft: 10 }}>
                            {viewMode === 'list' ? 'Map View' : 'List Results'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modals */}
            <Modal visible={filtersOpen} animationType="slide">
                <Screen edges={['top', 'bottom']} backgroundColor={colors.neutrals.background}>
                    <FilterSidebar
                        filters={filters}
                        onChange={setFilters}
                        onClose={() => setFiltersOpen(false)}
                        compact
                    />
                </Screen>
            </Modal>

            <Modal visible={sortOpen} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setSortOpen(false)} activeOpacity={1}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHandle} />
                        <Text variant="h3" weight="heavy" align="center">Sort By</Text>
                        <Spacer size="xl" />
                        {(['best', 'nearest', 'rating', 'price'] as TutorSearchRequest['sortBy'][]).map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.sheetOption, sortBy === opt && styles.sheetOptionActive]}
                                onPress={() => { setSortBy(opt); setSortOpen(false); }}
                            >
                                <View style={styles.optionLeft}>
                                    <Ionicons
                                        name={opt === 'best' ? 'sparkles' : opt === 'nearest' ? 'location' : opt === 'rating' ? 'star' : 'cash'}
                                        size={20}
                                        color={sortBy === opt ? colors.primary : colors.neutrals.textSecondary}
                                    />
                                    <Text style={[styles.optionText, sortBy === opt && styles.optionTextActive]}>
                                        {sortLabel(opt)}
                                    </Text>
                                </View>
                                {sortBy === opt && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </Screen>
    );
}

function sortLabel(s: TutorSearchRequest['sortBy']) {
    switch (s) {
        case 'nearest': return 'Nearest First';
        case 'rating': return 'Highest Rated';
        case 'price': return 'Lowest Price';
        default: return 'Best Relevance';
    }
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: spacing.md,
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
        zIndex: 100,
        ...shadows.sm,
    },
    headerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchWrapper: {
        flex: 1,
    },
    mobileFilterToggle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    layout: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.neutrals.background,
    },
    sidebarWrapper: {
        width: 320,
        backgroundColor: colors.neutrals.surface,
        borderRightWidth: 1,
        borderRightColor: colors.neutrals.border,
        ...Platform.select({
            web: {
                height: 'calc(100vh - 73px)' as any,
                position: 'sticky' as any,
                top: 73,
            }
        }),
    },
    resultsWrapper: {
        flex: 2,
    },
    resultsScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing['5xl'],
    },
    mapWrapperWeb: {
        flex: 1.5,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderLeftWidth: 1,
        borderLeftColor: colors.neutrals.border,
        ...Platform.select({
            web: {
                height: 'calc(100vh - 73px)' as any,
                position: 'sticky' as any,
                top: 73,
            }
        }),
    },
    mapWrapperMobile: {
        ...StyleSheet.absoluteFillObject,
        top: 73,
    },
    visible: {
        display: 'flex',
    },
    hidden: {
        display: 'none',
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
        gap: spacing.md,
    },
    countBadge: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    mobileFilterBtn: {
        ...shadows.sm,
    },
    filterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primarySoft,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    sortToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.sm,
    },
    resultsGrid: {
        width: '100%',
    },
    cardWrapper: {
        width: '100%',
        maxWidth: 800,
        alignSelf: 'center',
    },
    loaderBox: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    mobileActions: {
        position: 'absolute',
        bottom: spacing.xl,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 200,
    },
    toggleBtn: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.textPrimary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        ...shadows.lg,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: colors.neutrals.surface,
        padding: spacing.xl,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingBottom: spacing['4xl'],
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: colors.neutrals.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    sheetOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: 16,
        marginBottom: spacing.xs,
    },
    sheetOptionActive: {
        backgroundColor: colors.primarySoft,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.neutrals.textPrimary,
    },
    optionTextActive: {
        color: colors.primary,
    }
});

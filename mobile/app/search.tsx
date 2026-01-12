import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Platform, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FilterSidebar, MapPanelPlaceholder, TutorCard, TutorCardWeb, HomeSearchBar, SkeletonList } from '../src/components';
import { colors, spacing, typography, borderRadius, layout, shadows } from '../src/lib/theme';
import { useBreakpoint } from '../src/lib/responsive';
import { useSearchTutors } from '../src/hooks/useTutors';
import { SearchFiltersState } from '../src/components/FilterSidebar';
import { TeachingMode, TutorSearchRequest, TutorSearchResult } from '../src/types';
import { useAuthStore } from '../src/store/authStore';

export default function SearchPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const params = useLocalSearchParams<{ subject?: string; location?: string; radius?: string; mode?: string; rating45?: string; midPrice?: string; dbs?: string; weekends?: string; availabilityDay?: string }>();
    const { isLg, isMd, width } = useBreakpoint();

    const [subject, setSubject] = useState(params.subject ?? '');
    const [location, setLocation] = useState(params.location ?? '');
    const [sortBy, setSortBy] = useState<TutorSearchRequest['sortBy']>('best');
    const [availabilityDay, setAvailabilityDay] = useState<number | undefined>(params.availabilityDay ? Number(params.availabilityDay) : undefined);
    const [sortOpen, setSortOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>(isLg ? 'split' : 'list');
    const [hoveredTutorId, setHoveredTutorId] = useState<string | undefined>(undefined);

    const quickDefaults = {
        dbs: params.dbs === '1',
        weekends: params.weekends === '1',
        rating45: params.rating45 === '1',
        midPrice: params.midPrice === '1',
    } as const;

    const [filters, setFilters] = useState<SearchFiltersState>({
        radiusMiles: params.radius ? Number(params.radius) : 10,
        mode: params.mode ? Number(params.mode) as TeachingMode : undefined,
        minRating: quickDefaults.rating45 ? 4.5 : undefined,
        priceMin: quickDefaults.midPrice ? 20 : undefined,
        priceMax: quickDefaults.midPrice ? 40 : undefined,
        quickFilters: quickDefaults,
    });
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    useEffect(() => {
        setViewMode(isLg ? 'split' : 'list');
    }, [isLg]);

    const searchParams = useMemo<TutorSearchRequest>(() => ({
        subject: subject || undefined,
        postcode: location || undefined,
        radiusMiles: filters.radiusMiles,
        mode: filters.mode,
        minRating: filters.minRating,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        page,
        pageSize,
        sortBy,
        availabilityDay,
    }), [subject, location, filters, sortBy, page, pageSize, availabilityDay]);

    const { data: tutorsPage, isLoading, isError, refetch, isFetching } = useSearchTutors(searchParams);

    const [allResults, setAllResults] = useState<TutorSearchResult[]>([]);
    const results = allResults;
    const resultsCount = tutorsPage?.total ?? 0;
    const hasMore = tutorsPage ? results.length < tutorsPage.total : false;

    const handleCardPress = (tutor: TutorSearchResult) => {
        router.push(`/tutor/${tutor.id}`);
    };

    const handleSearch = () => {
        setPage(1);
        refetch();
    };

    useEffect(() => {
        setPage(1);
        setAllResults([]);
    }, [subject, location, filters, sortBy]);

    useEffect(() => {
        if (!tutorsPage) return;
        setAllResults((prev) => {
            if (searchParams.page === 1) return tutorsPage.items ?? [];
            const incoming = tutorsPage.items ?? [];
            const existingIds = new Set(prev.map((p) => p.id));
            const merged = [...prev, ...incoming.filter((i: TutorSearchResult) => !existingIds.has(i.id))];
            return merged;
        });
    }, [tutorsPage, searchParams.page]);

    const handleLoadMore = () => {
        if (!hasMore || isFetching) return;
        setPage((prev) => prev + 1);
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 200;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            handleLoadMore();
        }
    };

    const renderTopBar = () => (
        <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
                <Text style={styles.resultCount}>{resultsCount} tutors found</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>Showing {results.length}</Text>
                </View>
            </View>
            <View style={styles.topBarRight}>
                <View style={[styles.sortMenu, { zIndex: 100 }]}>
                    <TouchableOpacity style={styles.sortTrigger} onPress={() => setSortOpen((prev) => !prev)}>
                        <Text style={styles.sortLabel}>Sort by:</Text>
                        <Text style={styles.sortValue}>{sortLabel(sortBy)}</Text>
                        <Text style={styles.sortChevron}>▼</Text>
                    </TouchableOpacity>
                    {sortOpen && (
                        <View style={styles.sortOptions}>
                            {(['best', 'nearest', 'rating', 'price'] as TutorSearchRequest['sortBy'][]).map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                        setSortBy(option);
                                        setSortOpen(false);
                                    }}
                                    style={[styles.sortOption, option === sortBy && styles.sortOptionActive]}
                                >
                                    <Text style={[styles.sortOptionText, option === sortBy && styles.sortOptionTextActive]}>{sortLabel(option)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {isLg && (
                    <View style={styles.viewToggle}>
                        <ToggleButton label="List View" active={viewMode === 'split'} onPress={() => setViewMode('split')} />
                        <ToggleButton label="Full Map" active={viewMode === 'map'} onPress={() => setViewMode('map')} />
                    </View>
                )}

                {!isLg && (
                    <TouchableOpacity style={styles.filterTrigger} onPress={() => setFiltersOpen(true)}>
                        <Text style={styles.filterTriggerText}>Filters</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderList = () => (
        <View style={styles.cardStack}>
            {results.map((tutor) => (
                <View key={tutor.id} style={styles.cardWrapper}>
                    {isMd ? (
                        <TutorCardWeb
                            tutor={tutor}
                            onPress={() => handleCardPress(tutor)}
                            onViewProfile={() => handleCardPress(tutor)}
                            onRequestBooking={() => handleCardPress(tutor)}
                            onMouseEnter={() => setHoveredTutorId(tutor.id)}
                            onMouseLeave={() => setHoveredTutorId(undefined)}
                        />
                    ) : (
                        <TutorCard tutor={tutor} onPress={() => handleCardPress(tutor)} />
                    )}
                </View>
            ))}
        </View>
    );

    const renderContent = () => {
        if (isLoading && results.length === 0) {
            // Render specific skeletons based on view mode if needed, but generic list is fine
            return (
                <View style={styles.cardStack}>
                    <SkeletonList />
                </View>
            );
        }

        if (isError) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Could not load tutors. Please adjust filters and try again.</Text>
                    <TouchableOpacity style={styles.retry} onPress={() => refetch()}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
                </View>
            );
        }

        if (results.length === 0 && !isFetching) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No tutors found matching your search.</Text>
                    <TouchableOpacity style={styles.retry} onPress={() => {
                        setSubject('');
                        setLocation('');
                        setFilters({ ...filters, radiusMiles: 10, mode: undefined });
                    }}><Text style={styles.retryText}>Clear all filters</Text></TouchableOpacity>
                </View>
            );
        }

        if (viewMode === 'map' && !isLg) {
            return <MapPanelPlaceholder tutors={results} activeTutorId={hoveredTutorId} />;
        }

        if (viewMode === 'split' && isLg) {
            return (
                <View style={styles.splitLayout}>
                    <View style={styles.splitList}>{renderList()}</View>
                    <View style={styles.splitMap}>
                        <MapPanelPlaceholder tutors={results} activeTutorId={hoveredTutorId} />
                    </View>
                </View>
            );
        }

        return renderList();
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.navbarOuter}>
                <View style={[styles.navbar, { maxWidth: layout.contentMaxWidth + 400, alignSelf: 'center', width: '100%', paddingHorizontal: spacing.xl }]}>
                    <TouchableOpacity onPress={() => router.push('/')} style={styles.brandRow}>
                        <View style={styles.logo}><Text style={styles.logoText}>T</Text></View>
                        <Text style={styles.brand}>TutorMatch UK</Text>
                    </TouchableOpacity>
                    <View style={styles.navActions}>
                        {isAuthenticated ? (
                            <TouchableOpacity onPress={() => router.push('/profile')}><Text style={styles.navLink}>My Profile</Text></TouchableOpacity>
                        ) : (
                            <>
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}><Text style={styles.navLink}>Login</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.navCta} onPress={() => router.push('/(auth)/register')}>
                                    <Text style={styles.navCtaText}>Sign up</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={[styles.page, { paddingHorizontal: width > layout.contentMaxWidth + 400 ? spacing.xl : spacing.lg }]}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={250}
                stickyHeaderIndices={[1]}
            >
                <View style={styles.searchShell}>
                    <HomeSearchBar
                        subject={subject}
                        location={location}
                        radius={filters.radiusMiles}
                        mode={filters.mode ?? TeachingMode.Both}
                        availabilityDay={availabilityDay}
                        onSubjectChange={setSubject}
                        onLocationChange={setLocation}
                        onRadiusChange={(val) => setFilters((prev) => ({ ...prev, radiusMiles: val }))}
                        onModeChange={(val) => setFilters((prev) => ({ ...prev, mode: val }))}
                        onAvailabilityDayChange={setAvailabilityDay}
                        onSubmit={handleSearch}
                    />
                </View>

                {/* This empty view serves as a sticky header anchor if needed, or we just use resultsShell */}
                <View style={{ height: 1, backgroundColor: 'transparent' }} />

                <View style={styles.resultsShell}>
                    {isLg && (
                        <View style={styles.sidebarWrapper}>
                            <FilterSidebar filters={filters} onChange={setFilters} />
                        </View>
                    )}

                    <View style={styles.resultsColumn}>
                        {renderTopBar()}
                        <View style={styles.divider} />
                        {isFetching && results.length > 0 && <Text style={styles.loadingHint}>Updating results…</Text>}
                        {renderContent()}

                        {isFetching && hasMore && (
                            <View style={styles.loadingMoreRow}>
                                <ActivityIndicator size="small" color={colors.primary} />
                                <Text style={styles.loadingMoreText}>Loading more experts…</Text>
                            </View>
                        )}
                        {!hasMore && results.length > 0 && (
                            <View style={styles.footerNote}>
                                <Text style={styles.footerNoteText}>You've seen all available tutors for this search.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {!isLg && (
                <Modal visible={filtersOpen} animationType="slide" onRequestClose={() => setFiltersOpen(false)}>
                    <SafeAreaView style={styles.modalContainer}>
                        <FilterSidebar filters={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} compact />
                    </SafeAreaView>
                </Modal>
            )}
        </SafeAreaView>
    );
}

function ToggleButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity style={[styles.toggle, active && styles.toggleActive]} onPress={onPress} activeOpacity={0.85}>
            <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

function sortLabel(value: TutorSearchRequest['sortBy']) {
    switch (value) {
        case 'nearest':
            return 'Nearest First';
        case 'rating':
            return 'Top Rated';
        case 'price':
            return 'Price (Low to High)';
        default:
            return 'Best Match';
    }
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    navbarOuter: {
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
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
        width: 32,
        height: 32,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: colors.neutrals.surface,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.heavy,
    },
    brand: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
        letterSpacing: -0.5,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    navLink: {
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.semibold,
        fontSize: typography.fontSize.sm,
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
        fontSize: typography.fontSize.sm,
    },
    page: {
        paddingVertical: spacing.xl,
        gap: spacing.lg,
        alignItems: 'center',
    },
    searchShell: {
        width: '100%',
        maxWidth: layout.contentMaxWidth + 200,
        marginTop: spacing.sm,
    },
    resultsShell: {
        flexDirection: 'row',
        gap: spacing.xl,
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: layout.contentMaxWidth + 400,
    },
    sidebarWrapper: {
        width: 300,
        position: 'sticky' as any,
        top: spacing.lg,
    },
    resultsColumn: {
        flex: 1,
        gap: spacing.lg,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    resultCount: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    countBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    countBadgeText: {
        color: colors.neutrals.textSecondary,
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    sortMenu: {
        position: 'relative',
    },
    sortTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    sortLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.medium,
    },
    sortValue: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.bold,
    },
    sortChevron: {
        fontSize: 10,
        color: colors.neutrals.textMuted,
        marginLeft: spacing.xs,
    },
    sortOptions: {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: spacing.xs,
        width: 200,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        borderRadius: borderRadius.md,
        ...shadows.md,
        overflow: 'hidden',
    },
    sortOption: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    sortOptionActive: {
        backgroundColor: colors.primarySoft,
    },
    sortOptionText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
    },
    sortOptionTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surfaceAlt,
        padding: 4,
        borderRadius: borderRadius.md,
        gap: 4,
    },
    toggle: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
    },
    toggleActive: {
        backgroundColor: colors.neutrals.surface,
        ...shadows.sm,
    },
    toggleText: {
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.semibold,
        fontSize: 12,
    },
    toggleTextActive: {
        color: colors.primaryDark,
    },
    filterTrigger: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
    },
    filterTriggerText: {
        color: colors.neutrals.surface,
        fontWeight: typography.fontWeight.bold,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.cardBorder,
    },
    loadingHint: {
        fontSize: typography.fontSize.xs,
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    loadingMoreRow: {
        marginTop: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
    },
    loadingMoreText: {
        color: colors.neutrals.textSecondary,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    footerNote: {
        marginTop: spacing.xl,
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    footerNoteText: {
        color: colors.neutrals.textMuted,
        fontSize: typography.fontSize.sm,
    },
    cardStack: {
        gap: spacing.lg,
    },
    cardWrapper: {
        borderRadius: borderRadius.lg,
    },
    splitLayout: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    splitList: {
        flex: 1,
        gap: spacing.lg,
    },
    splitMap: {
        width: 440,
        height: 700,
        position: 'sticky' as any,
        top: spacing.lg,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['5xl'],
        gap: spacing.md,
    },
    emptyText: {
        color: colors.neutrals.textSecondary,
        fontSize: typography.fontSize.lg,
        textAlign: 'center',
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
    },
    retry: {
        marginTop: spacing.sm,
    },
    retryText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
});

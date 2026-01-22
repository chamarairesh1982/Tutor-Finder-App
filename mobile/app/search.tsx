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
import { Ionicons } from '@expo/vector-icons';

export default function SearchPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const params = useLocalSearchParams<{ subject?: string; location?: string; radius?: string; mode?: string; rating45?: string; midPrice?: string; dbs?: string; weekends?: string; availabilityDay?: string }>();
    const { isLg, width } = useBreakpoint();

    const [subject, setSubject] = useState(params.subject ?? '');
    const [location, setLocation] = useState(params.location ?? '');
    const [sortBy, setSortBy] = useState<TutorSearchRequest['sortBy']>('best');
    const [availabilityDay, setAvailabilityDay] = useState<number | undefined>(params.availabilityDay ? Number(params.availabilityDay) : undefined);
    const [sortOpen, setSortOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>(isLg ? 'list' : 'list');

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
            <Text style={styles.resultCountText}>{resultsCount} experts found</Text>
            <View style={styles.topBarRight}>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setFiltersOpen(true)}>
                    <Ionicons name="options-outline" size={18} color={colors.primaryDark} />
                    <Text style={styles.filterBtnText}>Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortBtn} onPress={() => setSortOpen(true)}>
                    <Ionicons name="swap-vertical" size={18} color={colors.primaryDark} />
                    <Text style={styles.sortBtnText}>{sortLabel(sortBy)}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderContent = () => {
        if (isLoading && results.length === 0) {
            return (
                <View style={styles.cardStack}>
                    <SkeletonList count={5} />
                </View>
            );
        }

        if (isError) {
            return (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
                    <Text style={styles.errorText}>We couldn't load the tutors.</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
                        <Text style={styles.retryBtnText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (results.length === 0 && !isFetching) {
            return (
                <View style={styles.centered}>
                    <Ionicons name="search-outline" size={48} color={colors.neutrals.textMuted} />
                    <Text style={styles.emptyText}>No results found.</Text>
                    <TouchableOpacity style={styles.clearBtn} onPress={() => {
                        setSubject('');
                        setLocation('');
                        setFilters({ ...filters, radiusMiles: 10, mode: undefined });
                    }}>
                        <Text style={styles.clearBtnText}>Clear Filters</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={[styles.cardStack, isLg && styles.cardStackDesktop]}>
                {results.map((tutor) => (
                    <View key={tutor.id} style={isLg && styles.cardWrapperDesktop}>
                        {isLg ? (
                            <TutorCardWeb
                                tutor={tutor}
                                onPress={() => handleCardPress(tutor)}
                                onViewProfile={() => handleCardPress(tutor)}
                                onRequestBooking={() => handleCardPress(tutor)}
                            />
                        ) : (
                            <TutorCard tutor={tutor} onPress={() => handleCardPress(tutor)} />
                        )}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
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
                                <TouchableOpacity style={styles.navLink} onPress={() => router.push('/(auth)/login')}>
                                    <Text style={styles.navLinkText}>Login</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.mobileNav}>
                    <SafeAreaView edges={['top']}>
                        <View style={styles.navContent}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                                <Ionicons name="arrow-back" size={24} color={colors.neutrals.textPrimary} />
                            </TouchableOpacity>
                            <Text style={styles.navTitle}>Search results</Text>
                            <View style={{ width: 40 }} />
                        </View>
                    </SafeAreaView>
                </View>
            )}

            <View style={[styles.mainLayout, isLg && styles.mainLayoutDesktop]}>
                {isLg && (
                    <View style={styles.sidebarSticky}>
                        <FilterSidebar filters={filters} onChange={setFilters} />
                    </View>
                )}

                <ScrollView
                    contentContainerStyle={[styles.scrollContent, isLg && styles.scrollContentDesktop]}
                    onScroll={onScroll}
                    scrollEventThrottle={250}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.searchBlock, isLg && styles.searchBlockDesktop]}>
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

                    <View style={[styles.resultsContainer, isLg && styles.resultsContainerDesktop]}>
                        {renderTopBar()}

                        <View style={styles.resultsArea}>
                            {renderContent()}

                            {isFetching && hasMore && (
                                <View style={styles.loadingMore}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                    <Text style={styles.loadingMoreText}>Fetching more experts...</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>

            <Modal visible={filtersOpen} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutrals.background }}>
                    <FilterSidebar filters={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} compact />
                </SafeAreaView>
            </Modal>

            <Modal visible={sortOpen} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortOpen(false)}>
                    <View style={styles.bottomSheet}>
                        <Text style={styles.sheetTitle}>Sort tutors by</Text>
                        {(['best', 'nearest', 'rating', 'price'] as TutorSearchRequest['sortBy'][]).map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.sheetOption, sortBy === option && styles.sheetOptionActive]}
                                onPress={() => { setSortBy(option); setSortOpen(false); }}
                            >
                                <Text style={[styles.sheetOptionText, sortBy === option && styles.sheetOptionTextActive]}>
                                    {sortLabel(option)}
                                </Text>
                                {sortBy === option && <Ionicons name="checkmark" size={20} color={colors.primaryDark} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

function sortLabel(value: TutorSearchRequest['sortBy']) {
    switch (value) {
        case 'nearest': return 'Nearest';
        case 'rating': return 'Top Rated';
        case 'price': return 'Price Low-High';
        default: return 'Best Match';
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
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
    mobileNav: {
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
        zIndex: 1000,
    },
    navContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: spacing.md,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.neutrals.textPrimary,
    },
    mainLayout: {
        flex: 1,
    },
    mainLayoutDesktop: {
        flexDirection: 'row',
        maxWidth: layout.wideContentMaxWidth,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.xl,
    },
    sidebarSticky: {
        width: 300,
        paddingTop: spacing.xl,
    },
    scrollContent: {
        paddingBottom: spacing['4xl'],
    },
    scrollContentDesktop: {
        flex: 1,
    },
    searchBlock: {
        padding: spacing.lg,
        backgroundColor: colors.neutrals.background,
    },
    searchBlockDesktop: {
        paddingHorizontal: 0,
        paddingVertical: spacing.xl,
    },
    resultsContainer: {
        flex: 1,
    },
    resultsContainerDesktop: {
        paddingBottom: spacing['4xl'],
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
    },
    resultCountText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.neutrals.textPrimary,
    },
    topBarRight: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.primarySoft,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    filterBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    sortBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.neutrals.textPrimary,
    },
    resultsArea: {
        paddingVertical: spacing.lg,
    },
    cardStack: {
        gap: spacing.sm,
    },
    cardStackDesktop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.sm,
    },
    cardWrapperDesktop: {
        width: '50%',
        padding: spacing.sm,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['5xl'],
        gap: spacing.md,
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
    },
    retryBtn: {
        padding: spacing.md,
    },
    retryBtnText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
    },
    clearBtn: {
        padding: spacing.md,
    },
    clearBtnText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    loadingMore: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
        gap: 8,
    },
    loadingMoreText: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: colors.neutrals.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: spacing.xl,
        paddingBottom: spacing['4xl'],
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    sheetOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.surfaceAlt,
    },
    sheetOptionActive: {
        backgroundColor: colors.primarySoft + '40',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
    },
    sheetOptionText: {
        fontSize: 16,
        color: colors.neutrals.textPrimary,
        fontWeight: '500',
    },
    sheetOptionTextActive: {
        color: colors.primaryDark,
        fontWeight: '700',
    },
});

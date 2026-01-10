import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FilterSidebar, MapPanelPlaceholder, TutorCard, TutorCardWeb, HomeSearchBar } from '../src/components';
import { colors, spacing, typography, borderRadius, layout } from '../src/lib/theme';
import { useBreakpoint } from '../src/lib/responsive';
import { useSearchTutors } from '../src/hooks/useTutors';
import { SearchFiltersState } from '../src/components/FilterSidebar';
import { TeachingMode, TutorSearchRequest, TutorSearchResult } from '../src/types';

export default function SearchPage() {
    const router = useRouter();
    const params = useLocalSearchParams<{ subject?: string; location?: string; radius?: string; mode?: string; rating45?: string; midPrice?: string; dbs?: string; weekends?: string }>();
    const { isLg, isMd, width } = useBreakpoint();

    const [subject, setSubject] = useState(params.subject ?? '');
    const [location, setLocation] = useState(params.location ?? '');
    const [sortBy, setSortBy] = useState<TutorSearchRequest['sortBy']>('best');
    const [sortOpen, setSortOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>(isLg ? 'split' : 'list');
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
        page: 1,
        pageSize: 20,
        sortBy,
    }), [subject, location, filters, sortBy]);

    const { data: tutors, isLoading, isError, refetch, isFetching } = useSearchTutors(searchParams);

    const resultsCount = tutors?.length ?? 0;

    const handleCardPress = (tutor: TutorSearchResult) => {
        router.push(`/tutor/${tutor.id}`);
    };

    const handleSearch = () => {
        refetch();
    };

    const renderTopBar = () => (
        <View style={styles.topBar}>
            <Text style={styles.resultCount}>{resultsCount} tutors</Text>
            <View style={styles.topBarRight}>
                <View style={styles.sortMenu}>
                    <TouchableOpacity style={styles.sortTrigger} onPress={() => setSortOpen((prev) => !prev)}>
                        <Text style={styles.sortLabel}>Sort</Text>
                        <Text style={styles.sortValue}>{sortLabel(sortBy)}</Text>
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
                                    style={styles.sortOption}
                                >
                                    <Text style={[styles.sortOptionText, option === sortBy && styles.sortOptionTextActive]}>{sortLabel(option)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.viewToggle}>
                    <ToggleButton label="List" active={viewMode === 'list' || viewMode === 'split'} onPress={() => setViewMode(isLg ? 'split' : 'list')} />
                    <ToggleButton label="Map" active={viewMode === 'map'} onPress={() => setViewMode('map')} />
                </View>

                {!isLg && (
                    <TouchableOpacity style={styles.filterButton} onPress={() => setFiltersOpen(true)}>
                        <Text style={styles.filterButtonText}>Filters</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderList = () => (
        <View style={styles.cardStack}>
            {tutors?.map((tutor) => (
                <View key={tutor.id} style={styles.cardWrapper}>
                    {isMd ? (
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

    const renderContent = () => {
        if (!searchParams.postcode) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Add a location to see tutors near you.</Text>
                </View>
            );
        }

        if (isLoading && !tutors) {
            return (
                <View style={styles.centered}> <ActivityIndicator size="large" color={colors.primary} /> </View>
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

        if (!tutors || tutors.length === 0) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No tutors match these filters yet.</Text>
                </View>
            );
        }

        if (viewMode === 'map' && !isLg) {
            return <MapPanelPlaceholder tutors={tutors} />;
        }

        if (viewMode === 'split' && isLg) {
            return (
                <View style={styles.splitLayout}>
                    <View style={styles.splitList}>{renderList()}</View>
                    <View style={styles.splitMap}>
                        <MapPanelPlaceholder tutors={tutors} />
                    </View>
                </View>
            );
        }

        return renderList();
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

                <View style={styles.searchShell}>
                    <HomeSearchBar
                        subject={subject}
                        location={location}
                        radius={filters.radiusMiles}
                        mode={filters.mode ?? TeachingMode.Both}
                        onSubjectChange={setSubject}
                        onLocationChange={setLocation}
                        onRadiusChange={(val) => setFilters((prev) => ({ ...prev, radiusMiles: val }))}
                        onModeChange={(val) => setFilters((prev) => ({ ...prev, mode: val }))}
                        onSubmit={handleSearch}
                    />
                </View>

                <View style={styles.resultsShell}>
                    {isLg && (
                        <View style={styles.sidebarWrapper}>
                            <FilterSidebar filters={filters} onChange={setFilters} />
                        </View>
                    )}

                    <View style={styles.resultsColumn}>
                        {renderTopBar()}
                        <View style={styles.divider} />
                        {isFetching && tutors && <Text style={styles.loadingHint}>Updating results…</Text>}
                        {renderContent()}
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
            return 'Nearest';
        case 'rating':
            return 'Rating';
        case 'price':
            return 'Price';
        default:
            return 'Best match';
    }
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
        paddingHorizontal: spacing.sm,
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
    searchShell: {
        marginTop: spacing.md,
    },
    resultsShell: {
        flexDirection: 'row',
        gap: spacing.lg,
        alignItems: 'flex-start',
    },
    sidebarWrapper: {
        width: 320,
        position: 'sticky' as any,
        top: spacing.lg,
    },
    resultsColumn: {
        flex: 1,
        gap: spacing.md,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    resultCount: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    sortMenu: {
        position: 'relative',
        zIndex: 10,
    },
    sortTrigger: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surface,
    },
    sortLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        textTransform: 'uppercase',
    },
    sortValue: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    sortOptions: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: spacing.xs,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        zIndex: 5,
    },
    sortOption: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    sortOptionText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
    },
    sortOptionTextActive: {
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    viewToggle: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    toggle: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.neutrals.surface,
    },
    toggleActive: {
        backgroundColor: colors.primarySoft,
    },
    toggleText: {
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.semibold,
    },
    toggleTextActive: {
        color: colors.primaryDark,
    },
    filterButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    filterButtonText: {
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.cardBorder,
    },
    loadingHint: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
    },
    cardStack: {
        gap: spacing.md,
    },
    cardWrapper: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    splitLayout: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    splitList: {
        flex: 1,
        gap: spacing.md,
    },
    splitMap: {
        width: 420,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['2xl'],
        paddingHorizontal: spacing.lg,
    },
    emptyText: {
        color: colors.neutrals.textSecondary,
        fontSize: typography.fontSize.base,
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
        padding: spacing.lg,
    },
});

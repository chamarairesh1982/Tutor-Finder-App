import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../src/hooks/useFavorites';
import { colors, spacing, typography, borderRadius, layout, shadows } from '../../src/lib/theme';
import { TutorCard } from '../../src/components';
import { TutorSearchResult, TeachingMode } from '../../src/types';

export default function FavoritesScreen() {
    const { data: favorites, isLoading, isError, refetch } = useFavorites();
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const router = useRouter();

    const onRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    const renderEmpty = () => (
        <View style={styles.centered}>
            <View style={styles.emptyIcon}><Text style={styles.emptyIconText}>♥</Text></View>
            <Text style={styles.emptyTitle}>No saved tutors yet</Text>
            <Text style={styles.emptySubtitle}>
                Tutors you save will appear here. Find your perfect match and keep them bookmarked.
            </Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/')}>
                <Text style={styles.browseButtonText}>Browse Tutors</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFavorite = ({ item }: { item: any }) => {
        // Map Favorite to TutorSearchResult for the TutorCard
        const tutor: TutorSearchResult = {
            id: item.tutorProfileId,
            fullName: item.tutorName,
            photoUrl: item.tutorPhotoUrl,
            category: item.tutorCategory,
            subjects: item.subjects,
            pricePerHour: item.tutorPricePerHour,
            averageRating: item.tutorAverageRating,
            reviewCount: item.tutorReviewCount,
            distanceMiles: 0,
            nextAvailableText: 'Saved tutor',
            hasDbs: item.hasDbs,
            hasCertification: item.hasCertification
        };

        return (
            <TutorCard
                tutor={tutor}
                onPress={() => router.push(`/tutor/${tutor.id}`)}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Saved Experts</Text>
                    <Text style={styles.subtitle}>{favorites?.length || 0} tutors in your list</Text>
                </View>

                {isLoading ? (
                    <View style={styles.centered}>
                        <Text style={styles.loadingText}>Loading your favorites...</Text>
                    </View>
                ) : isError ? (
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Failed to load favorites</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={favorites}
                        renderItem={renderFavorite}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={renderEmpty}
                        showsVerticalScrollIndicator={false}
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.xl,
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        marginTop: 4,
        fontWeight: typography.fontWeight.medium,
    },
    listContent: {
        paddingVertical: spacing.lg,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['3xl'],
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emptyIconText: {
        fontSize: 40,
        color: colors.primary,
    },
    emptyTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.sm,
    },
    emptySubtitle: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing['2xl'],
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing['2xl'],
        borderRadius: borderRadius.full,
        ...shadows.md,
    },
    browseButtonText: {
        color: colors.neutrals.surface,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
    loadingText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
        marginBottom: spacing.md,
    },
    retryButton: {
        padding: spacing.md,
    },
    retryButtonText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
});

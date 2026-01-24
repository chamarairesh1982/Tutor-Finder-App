import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../src/hooks/useFavorites';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { TutorCard, Text, ErrorState, EmptyState } from '../../src/components';
import { TutorSearchResult } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
    const { data: favorites, isLoading, isError, refetch } = useFavorites();
    const router = useRouter();

    const renderEmpty = () => (
        <EmptyState
            title="Keep your favorites here"
            message="Tap the heart on any tutor profile to save them for later. It’s the easiest way to find your perfect match again."
            icon="heart-outline"
            actionLabel="Explore Tutors"
            onAction={() => router.push('/')}
        />
    );

    const renderFavorite = ({ item }: { item: any }) => {
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
            nextAvailableText: 'Saved Expert',
            hasDbs: item.hasDbs,
            hasCertification: item.hasCertification
        };

        return (
            <View style={styles.cardContainer}>
                <TutorCard
                    tutor={tutor}
                    onPress={() => router.push(`/tutor/${tutor.id}`)}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Saved Experts</Text>
                <Text style={styles.countText}>{favorites?.length || 0} tutors saved</Text>
            </View>

            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : isError ? (
                <ErrorState
                    title="Something went wrong"
                    message="We couldn't load your saved tutors."
                    onRetry={() => refetch()}
                />
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderFavorite}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -1,
    },
    countText: {
        fontSize: 14,
        color: colors.neutrals.textSecondary,
        fontWeight: '500',
        marginTop: 2,
    },
    listContent: {
        paddingBottom: spacing['4xl'],
    },
    cardContainer: {
        paddingVertical: spacing.xs,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing['2xl'],
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.full,
        ...shadows.md,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        marginVertical: spacing.md,
    },
    retryButton: {
        padding: spacing.md,
    },
    retryText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

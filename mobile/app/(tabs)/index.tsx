import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TutorCard, FilterChips, Input } from '../../src/components';
import { useSearchTutors } from '../../src/hooks/useTutors';
import { colors, spacing, typography } from '../../src/lib/theme';
import { Category, TutorSearchResult } from '../../src/types';

const categoryChips = [
    { key: 'all', label: 'All' },
    { key: String(Category.Music), label: 'Music' },
    { key: String(Category.Maths), label: 'Maths' },
    { key: String(Category.English), label: 'English' },
    { key: String(Category.Science), label: 'Science' },
    { key: String(Category.Languages), label: 'Languages' },
    { key: String(Category.Programming), label: 'Programming' },
];

export default function DiscoverScreen() {
    const router = useRouter();
    const [postcode, setPostcode] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>(['all']);

    const searchParams = {
        postcode: postcode.length >= 3 ? postcode : undefined,
        radiusMiles: 15,
        category: selectedCategory[0] !== 'all' ? Number(selectedCategory[0]) as Category : undefined,
        page: 1,
        pageSize: 20,
        sortBy: 'best' as const,
    };

    const { data: tutors, isLoading, isError } = useSearchTutors(searchParams);

    const handleCategorySelect = (key: string) => {
        setSelectedCategory([key]);
    };

    const handleTutorPress = (tutor: TutorSearchResult) => {
        router.push(`/tutor/${tutor.id}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Find a Tutor</Text>
                <Input
                    placeholder="Enter your postcode (e.g., SW1A 1AA)"
                    value={postcode}
                    onChangeText={setPostcode}
                    autoCapitalize="characters"
                />
            </View>

            <FilterChips
                chips={categoryChips}
                selectedKeys={selectedCategory}
                onSelect={handleCategorySelect}
                multiSelect={false}
            />

            {isLoading && (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}

            {isError && (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Failed to load tutors. Please try again.</Text>
                </View>
            )}

            {!postcode && (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Enter your postcode to find tutors near you</Text>
                </View>
            )}

            {tutors && tutors.length === 0 && postcode && (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No tutors found. Try a different search.</Text>
                </View>
            )}

            {tutors && tutors.length > 0 && (
                <FlatList
                    data={tutors}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TutorCard tutor={item} onPress={() => handleTutorPress(item)} />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.md,
        letterSpacing: -0.5,
    },
    listContent: {
        paddingTop: spacing.sm,
        paddingBottom: spacing.xl,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing['2xl'],
    },
    emptyText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
        textAlign: 'center',
    },
});

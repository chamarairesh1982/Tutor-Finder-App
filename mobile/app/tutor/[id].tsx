import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTutorProfile } from '../../src/hooks/useTutors';
import { useCreateBooking } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { BookingPanel, ReviewList } from '../../src/components';
import { colors, spacing, typography, borderRadius, layout } from '../../src/lib/theme';
import { Category, TeachingMode } from '../../src/types';
import { useBreakpoint } from '../../src/lib/responsive';
import { Button } from '../../src/components/Button';

export default function TutorDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { data: tutor, isLoading, isError } = useTutorProfile(id!);
    const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();
    const { isLg, width } = useBreakpoint();

    const [initialMessage, setInitialMessage] = useState('');
    const [preferredMode, setPreferredMode] = useState<TeachingMode>(TeachingMode.Both);
    const [preferredDate, setPreferredDate] = useState('');
    const [reviewSort, setReviewSort] = useState<'recent' | 'highest'>('recent');

    const handleBooking = () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }

        if (!initialMessage.trim()) {
            Alert.alert('Message Required', 'Please enter a message for the tutor.');
            return;
        }

        createBooking(
            {
                tutorId: id!,
                preferredMode,
                preferredDate: preferredDate || undefined,
                initialMessage: initialMessage.trim(),
            },
            {
                onSuccess: () => {
                    Alert.alert('Request Sent', 'Your booking request has been sent to the tutor.', [
                        { text: 'View Bookings', onPress: () => router.push('/bookings') },
                        { text: 'OK' }
                    ]);
                    setInitialMessage('');
                    setPreferredDate('');
                },
                onError: (error: any) => {
                    const msg = error.response?.data?.detail || 'Failed to send booking request.';
                    Alert.alert('Error', msg);
                }
            }
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isError || !tutor) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Tutor profile not found.</Text>
                <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
            </View>
        );
    }

    const teachingModeLabel = tutor.teachingMode === TeachingMode.Both ? 'In-person & online' : TeachingMode[tutor.teachingMode];

    const reviewList = tutor.reviews ?? [];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingHorizontal: width > layout.contentMaxWidth ? spacing.xl : spacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatarLarge}>
                                {tutor.photoUrl ? (
                                    <Image source={{ uri: tutor.photoUrl }} style={styles.avatarImg} />
                                ) : (
                                    <Text style={styles.avatarInitial}>{tutor.fullName.charAt(0)}</Text>
                                )}
                            </View>
                            <View style={styles.nameSection}>
                                <Text style={styles.fullName}>{tutor.fullName}</Text>
                                <Text style={styles.categoryText}>{Category[tutor.category]}</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.ratingStars}>{'★'.repeat(Math.round(tutor.averageRating))}</Text>
                                    <Text style={styles.reviewCount}>({tutor.reviewCount} reviews)</Text>
                                </View>
                                <View style={styles.metaRow}>
                                    <MetaBadge label={`£${tutor.pricePerHour}/hr`} />
                                    <MetaBadge label={teachingModeLabel} />
                                    <MetaBadge label={tutor.postcode} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.topCtas}>
                            <Button title="Request booking" onPress={handleBooking} isLoading={isBookingPending} />
                            <Button title="Share profile" variant="outline" onPress={() => { }} />
                        </View>
                    </View>
                </View>

                <View style={[styles.bodyLayout, isLg && styles.bodyLayoutWide]}>
                    <View style={styles.contentColumn}>
                        <InfoSection title="About" body={tutor.bio} />
                        <InfoSection title="Teaching style" body="Practical, confidence-building lessons tailored to each learner. Share goals in your booking message for a bespoke plan." />
                        <InfoSection title="Specialities" body={tutor.subjects.join(', ')} />
                        <InfoSection title="Location & mode" body={`Based around ${tutor.postcode}. Offers ${teachingModeLabel.toLowerCase()}.`} />
                        <InfoSection title="Availability" body={tutor.nextAvailableText || 'Share your preferred times in the request.'} />

                        <View style={styles.sectionCard}>
                            <ReviewList
                                reviews={reviewList}
                                averageRating={tutor.averageRating}
                                totalCount={tutor.reviewCount}
                                sort={reviewSort}
                                onSortChange={setReviewSort}
                            />
                        </View>
                    </View>

                    <View style={[styles.bookingColumn, isLg && styles.bookingSticky]}>
                        <BookingPanel
                            pricePerHour={tutor.pricePerHour}
                            mode={preferredMode}
                            onModeChange={setPreferredMode}
                            preferredDate={preferredDate}
                            onPreferredDateChange={setPreferredDate}
                            message={initialMessage}
                            onMessageChange={setInitialMessage}
                            onSubmit={handleBooking}
                            isSubmitting={isBookingPending}
                            responseTimeText={tutor.responseTimeText}
                        />
                        <View style={styles.safetyBox}>
                            <Text style={styles.safetyTitle}>Safety first</Text>
                            <Text style={styles.safetyText}>Keep chats inside TutorFinder. We’ll share contact details only after a booking is confirmed.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function InfoSection({ title, body }: { title: string; body: string }) {
    return (
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionBody}>{body}</Text>
        </View>
    );
}

function MetaBadge({ label }: { label: string }) {
    return (
        <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    scrollContent: {
        paddingVertical: spacing['2xl'],
        gap: spacing.lg,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    headerCard: {
        backgroundColor: colors.neutrals.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.lg,
        alignItems: 'center',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        flex: 1,
    },
    avatarLarge: {
        width: 112,
        height: 112,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 36,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.background,
    },
    nameSection: {
        flex: 1,
        gap: spacing.xs,
    },
    fullName: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    categoryText: {
        fontSize: typography.fontSize.base,
        color: colors.primary,
        fontWeight: typography.fontWeight.medium,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    ratingStars: {
        color: colors.ratingStars,
        fontSize: typography.fontSize.lg,
    },
    reviewCount: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    metaBadge: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    metaBadgeText: {
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    topCtas: {
        gap: spacing.sm,
    },
    bodyLayout: {
        gap: spacing.lg,
    },
    bodyLayoutWide: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contentColumn: {
        flex: 1,
        gap: spacing.md,
    },
    bookingColumn: {
        flex: 1,
        gap: spacing.md,
    },
    bookingSticky: {
        maxWidth: 420,
        alignSelf: 'flex-start',
        position: 'sticky' as any,
        top: spacing.lg,
    },
    sectionCard: {
        backgroundColor: colors.neutrals.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    sectionTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.sm,
    },
    sectionBody: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        lineHeight: 24,
    },
    safetyBox: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        padding: spacing.md,
        gap: spacing.xs,
    },
    safetyTitle: {
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    safetyText: {
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
    },
});

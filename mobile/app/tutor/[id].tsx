import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Alert, ActivityIndicator, Platform, Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTutorProfile } from '../../src/hooks/useTutors';
import { useCreateBooking, useMyBookings } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { useNotificationStore } from '../../src/store/notificationStore';
import { BookingPanel, ReviewList, AvailabilitySchedule } from '../../src/components';
import { colors, spacing, typography, borderRadius, layout, shadows } from '../../src/lib/theme';
import { BookingStatus, Category, TeachingMode } from '../../src/types';
import { useBreakpoint } from '../../src/lib/responsive';
import { Button } from '../../src/components/Button';

export default function TutorDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const notify = useNotificationStore((s) => s.addToast);

    const { data: tutor, isLoading, isError } = useTutorProfile(id!);
    const { data: myBookings } = useMyBookings(isAuthenticated);
    const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();
    const { isLg, width } = useBreakpoint();

    const [initialMessage, setInitialMessage] = useState('');
    const [preferredMode, setPreferredMode] = useState<TeachingMode>(TeachingMode.Both);
    const [preferredDate, setPreferredDate] = useState('');
    const [reviewSort, setReviewSort] = useState<'recent' | 'highest'>('recent');
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    const activeBooking = useMemo(() => {
        const list = Array.isArray(myBookings) ? myBookings : [];
        const relevant = list
            .filter((b) => b.tutorId === id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return relevant.find((b) =>
            b.status === BookingStatus.Pending ||
            b.status === BookingStatus.Accepted ||
            b.status === BookingStatus.Completed
        );
    }, [id, myBookings]);

    const handleBooking = () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }

        if (activeBooking) {
            notify({
                type: 'info',
                title: 'You already have a booking',
                message: 'Open the existing request to message or check status.',
            });
            router.push(`/booking/${activeBooking.id}`);
            return;
        }

        if (!initialMessage.trim()) {
            notify({ type: 'error', title: 'Message required', message: 'Please add a short message for the tutor.' });
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
                onSuccess: (booking) => {
                    setBookingModalOpen(false);
                    notify({ type: 'success', title: 'Request sent', message: 'The tutor will reply soon.' });
                    setInitialMessage('');
                    setPreferredDate('');
                    router.push(`/booking/${booking.id}`);
                },
                onError: (error: any) => {
                    const msg = error?.response?.data?.detail || 'Failed to send booking request.';
                    notify({ type: 'error', title: 'Request failed', message: msg });
                }
            }
        );
    };

    const openBookingModal = () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }

        if (activeBooking) {
            notify({
                type: 'info',
                title: 'Booking already in progress',
                message: 'Open your booking to continue the chat.',
            });
            router.push(`/booking/${activeBooking.id}`);
            return;
        }

        setBookingModalOpen(true);
    }

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

    const teachingModeLabel = (() => {
        switch (tutor.teachingMode) {
            case TeachingMode.InPerson:
                return 'In-person';
            case TeachingMode.Online:
                return 'Online';
            default:
                return 'In-person & online';
        }
    })();

    const aboutText = tutor.bio?.trim() || 'This tutor is updating their bio.';
    const teachingStyleText = tutor.teachingStyle?.trim() || 'Practical, confidence-building lessons tailored to each learner.';
    const specialityList = (tutor.specialities?.length ? tutor.specialities : tutor.subjects) ?? [];
    const locationText = tutor.locationSummary ?? `Based around ${tutor.postcode}. Offers ${teachingModeLabel.toLowerCase()}.`;
    const availabilityText = tutor.availabilitySummary ?? tutor.nextAvailableText ?? 'Share your preferred times in the request.';
    const reviewList = tutor.reviews ?? [];

    const bookingCta = (() => {
        if (!activeBooking) {
            return {
                title: 'Request booking',
                onPress: openBookingModal,
                badge: null as null | string,
            };
        }

        switch (activeBooking.status) {
            case BookingStatus.Pending:
                return { title: 'View request', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: 'Pending' };
            case BookingStatus.Accepted:
                return { title: 'Message tutor', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: 'Accepted' };
            case BookingStatus.Completed:
                return { title: 'View booking', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: 'Completed' };
            default:
                return { title: 'View booking', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: null };
        }
    })();

    const infoSections = [
        {
            title: 'About',
            icon: '👤',
            body: aboutText
        },
        {
            title: 'Qualifications',
            icon: '🎓',
            items: [
                ...(tutor.qualifications?.split('\n').filter(l => l.trim()) ?? []),
                ...(tutor.hasDbs ? ['DBS Checked & Verified'] : []),
                ...(tutor.hasCertification ? ['Certified Tutor'] : []),
                'Verified Profile'
            ],
            isChecklist: true
        },
        {
            title: 'Teaching style',
            icon: '💡',
            body: teachingStyleText
        },
        {
            title: 'Specialties',
            icon: '✨',
            items: specialityList,
            isPill: true
        },
        {
            title: 'Location',
            icon: '📍',
            body: locationText
        },
        {
            title: 'Availability',
            icon: '🕒',
            body: availabilityText,
            slots: tutor.availabilitySlots
        },
        {
            title: 'Response Time',
            icon: '💬',
            body: tutor.responseTimeText ?? 'Usually replies within 24 hours'
        },
    ];

    const horizontalPadding = width > layout.contentMaxWidth ? spacing['2xl'] : spacing.lg;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageContent}>
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
                                    <View style={styles.nameHeader}>
                                        <Text style={styles.fullName}>{tutor.fullName}</Text>
                                        {(tutor.hasDbs || tutor.hasCertification) && (
                                            <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ Verified</Text></View>
                                        )}
                                    </View>
                                    <Text style={styles.categoryText}>{Category[tutor.category]}</Text>
                                    <View style={styles.ratingRow}>
                                        <Text style={styles.ratingValue}>{tutor.averageRating.toFixed(1)}</Text>
                                        <Text style={styles.ratingStars}>{'★'.repeat(Math.round(tutor.averageRating))}</Text>
                                        <Text style={styles.reviewCount}>({tutor.reviewCount} reviews)</Text>
                                    </View>
                                </View>
                            </View>
                            {isLg && (
                                <View style={styles.topCtas}>
                                    <Text style={styles.headerPrice}>£{tutor.pricePerHour}<Text style={styles.headerPriceUnit}>/hr</Text></Text>
                                    <Button title={bookingCta.title} onPress={bookingCta.onPress} isLoading={isBookingPending} size="lg" />
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={[styles.bodyLayout, isLg && styles.bodyLayoutWide]}>
                        <View style={styles.contentColumn}>
                            {infoSections.map((section) => (
                                <InfoSection key={section.title} section={section} />
                            ))}

                            <View style={styles.reviewsHeader}>
                                <Text style={styles.sectionTitle}>Student Reviews</Text>
                            </View>
                            <ReviewList
                                reviews={reviewList}
                                averageRating={tutor.averageRating}
                                totalCount={tutor.reviewCount}
                                ratingBreakdown={tutor.ratingBreakdown}
                                sort={reviewSort}
                                onSortChange={setReviewSort}
                            />
                        </View>

                        <View style={[styles.bookingColumn, isLg && styles.bookingSticky]}>
                            {activeBooking ? (
                                <View style={styles.bookingStatusCard}>
                                    <View style={styles.bookingStatusTop}>
                                        <Text style={styles.bookingStatusLabel}>Booking status</Text>
                                        {!!bookingCta.badge && (
                                            <View style={styles.bookingStatusBadge}>
                                                <Text style={styles.bookingStatusBadgeText}>{bookingCta.badge.toUpperCase()}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.bookingStatusHint}>You can message, cancel, or leave a review from your booking.</Text>
                                    <Button title={bookingCta.title} onPress={bookingCta.onPress} size="lg" />
                                </View>
                            ) : (
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
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {!isLg && (
                <>
                    <View style={styles.mobileBookingBar}>
                        <View>
                            <Text style={styles.mobilePrice}>£{tutor.pricePerHour}<Text style={styles.mobilePriceUnit}>/hr</Text></Text>
                            <Text style={styles.mobilePriceCaption}>Secure booking</Text>
                        </View>
                        <Button title={bookingCta.title} onPress={bookingCta.onPress} isLoading={isBookingPending} style={styles.mobileBookingBtn} />
                    </View>

                    <Modal visible={bookingModalOpen} animationType="slide" onRequestClose={() => setBookingModalOpen(false)}>
                        <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutrals.background }}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Request a Session</Text>
                                <TouchableOpacity onPress={() => setBookingModalOpen(false)} style={styles.closeBtn}>
                                    <Text style={styles.closeBtnText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
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
                            </ScrollView>
                        </SafeAreaView>
                    </Modal>
                </>
            )}
        </SafeAreaView>
    );
}

function InfoSection({ section }: { section: any }) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
                <View style={styles.iconCircle}><Text style={styles.sectionIcon}>{section.icon}</Text></View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {section.body && <Text style={[styles.sectionBody, section.slots && { marginBottom: spacing.md }]}>{section.body}</Text>}

            {section.title === 'Availability' && section.slots && (
                <AvailabilitySchedule slots={section.slots} />
            )}

            {section.isChecklist && (
                <View style={styles.checklist}>
                    {section.items.map((item: string, idx: number) => (
                        <View key={idx} style={styles.checkItem}>
                            <Text style={styles.checkIcon}>✓</Text>
                            <Text style={styles.checkText}>{item}</Text>
                        </View>
                    ))}
                </View>
            )}

            {section.isPill && (
                <View style={styles.pillRow}>
                    {section.items.map((item: string, idx: number) => (
                        <View key={idx} style={styles.specialtyPill}>
                            <Text style={styles.specialtyText}>{item}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    scrollContent: {
        paddingVertical: spacing.xl,
        gap: spacing.lg,
        alignItems: 'center',
    },
    pageContent: {
        width: '100%',
        maxWidth: layout.wideContentMaxWidth,
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
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.lg,
        alignItems: 'flex-start',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
        flex: 1,
    },
    avatarLarge: {
        width: 128,
        height: 128,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 48,
        fontWeight: typography.fontWeight.heavy,
        color: colors.primary,
    },
    nameSection: {
        flex: 1,
        gap: spacing.xs,
    },
    nameHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flexWrap: 'wrap',
    },
    fullName: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -1,
    },
    verifiedBadge: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    verifiedText: {
        color: colors.primaryDark,
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    categoryText: {
        fontSize: typography.fontSize.lg,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    ratingValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    ratingStars: {
        color: colors.ratingStars,
        fontSize: typography.fontSize.lg,
    },
    reviewCount: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    topCtas: {
        alignItems: 'flex-end',
        gap: spacing.md,
    },
    headerPrice: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
    },
    headerPriceUnit: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.normal,
    },
    bodyLayout: {
        gap: spacing.lg,
        width: '100%',
    },
    bodyLayoutWide: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.xl,
    },
    contentColumn: {
        flex: 1.2,
        gap: spacing.lg,
        minWidth: 0,
    },
    reviewsHeader: {
        marginTop: spacing.xl,
        marginBottom: -spacing.md,
    },
    bookingColumn: {
        flex: 0.8,
        gap: spacing.md,
        width: '100%',
    },
    bookingSticky: {
        maxWidth: 420,
        width: '100%',
        alignSelf: 'flex-start',
        position: 'sticky' as any,
        top: spacing.lg,
    },
    bookingStatusCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
        gap: spacing.md,
    },
    bookingStatusTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bookingStatusLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bookingStatusBadge: {
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    bookingStatusBadgeText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
        letterSpacing: 0.5,
    },
    bookingStatusHint: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
    sectionCard: {
        backgroundColor: colors.neutrals.surface,
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    sectionIcon: {
        fontSize: 18,
    },
    sectionTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    sectionBody: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        lineHeight: 26,
    },
    checklist: {
        gap: spacing.sm,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    checkIcon: {
        color: colors.success,
        fontSize: 18,
        fontWeight: typography.fontWeight.bold,
    },
    checkText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    specialtyPill: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    specialtyText: {
        color: colors.primaryDark,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
    mobileBookingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        backgroundColor: colors.neutrals.surface,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.cardBorder,
        ...shadows.lg,
    },
    mobilePrice: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    mobilePriceUnit: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
    },
    mobilePriceCaption: {
        fontSize: 11,
        color: colors.success,
        fontWeight: typography.fontWeight.bold,
    },
    mobileBookingBtn: {
        minWidth: 160,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.cardBorder,
    },
    modalTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    closeBtn: {
        padding: spacing.sm,
    },
    closeBtnText: {
        fontSize: 20,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textSecondary,
    },
});

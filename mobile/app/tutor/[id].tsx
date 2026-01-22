import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Alert, ActivityIndicator, Platform, Modal, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTutorProfile } from '../../src/hooks/useTutors';
import { useCreateBooking, useMyBookings } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { useNotificationStore } from '../../src/store/notificationStore';
import { BookingPanel, ReviewList, AvailabilitySchedule, SchedulePickerModal } from '../../src/components';
import { colors, spacing, typography, borderRadius, layout, shadows } from '../../src/lib/theme';
import { BookingStatus, Category, TeachingMode } from '../../src/types';
import { useBreakpoint } from '../../src/lib/responsive';
import { Button } from '../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';

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
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

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
                    setScheduleModalOpen(false);
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

    const handleSlotSelect = (day: string, time: string) => {
        const formatted = `${day} at ${time.substring(0, 5)}`;
        setPreferredDate(formatted);
        setScheduleModalOpen(false);
        if (!isLg && !bookingModalOpen) {
            setBookingModalOpen(true);
        }
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

    const teachingModeLabel = (() => {
        switch (tutor.teachingMode) {
            case TeachingMode.InPerson: return 'In-person';
            case TeachingMode.Online: return 'Online';
            default: return 'In-person & online';
        }
    })();

    const infoSections = [
        { title: 'About', icon: 'person', body: tutor.bio?.trim() || 'This tutor is updating their bio.' },
        {
            title: 'Qualifications',
            icon: 'school',
            items: [
                ...(tutor.qualifications?.split('\n').filter(l => l.trim()) ?? []),
                ...(tutor.hasDbs ? ['DBS Checked & Verified'] : []),
                ...(tutor.hasCertification ? ['Certified Tutor'] : []),
                'Verified Profile'
            ],
            isChecklist: true
        },
        { title: 'Teaching style', icon: 'bulb', body: tutor.teachingStyle?.trim() || 'Practical, confidence-building lessons tailored to each learner.' },
        { title: 'Specialties', icon: 'star', items: (tutor.specialities?.length ? tutor.specialities : tutor.subjects) ?? [], isPill: true },
        { title: 'Location', icon: 'location', body: tutor.locationSummary ?? `Based around ${tutor.postcode}. Offers ${teachingModeLabel.toLowerCase()}.` },
        { title: 'Availability', icon: 'time', body: tutor.availabilitySummary ?? tutor.nextAvailableText ?? 'Share your preferred times in the request.', slots: tutor.availabilitySlots },
        { title: 'Response Time', icon: 'chatbubbles', body: tutor.responseTimeText ?? 'Usually replies within 24 hours' },
    ];

    const bookingCta = (() => {
        if (!activeBooking) return { title: 'Request booking', onPress: openBookingModal, badge: null };
        switch (activeBooking.status) {
            case BookingStatus.Pending: return { title: 'View request', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: 'Pending' };
            case BookingStatus.Accepted: return { title: 'Message tutor', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: 'Accepted' };
            default: return { title: 'View booking', onPress: () => router.push(`/booking/${activeBooking.id}`), badge: null };
        }
    })();

    const horizontalPadding = width > layout.contentMaxWidth ? spacing['2xl'] : spacing.lg;

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
            {isLg && (
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
            )}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.pageContent}>
                    <View style={styles.heroSection}>
                        <View style={styles.heroBackground}>
                            {tutor.photoUrl ? (
                                <Image source={{ uri: tutor.photoUrl }} style={styles.heroBlur} blurRadius={Platform.OS === 'ios' ? 20 : 5} />
                            ) : (
                                <View style={[styles.heroBlur, { backgroundColor: colors.primary }]} />
                            )}
                            <View style={styles.heroOverlay} />
                        </View>

                        <View style={styles.heroContent}>
                            <View style={styles.profileHeaderRow}>
                                <View style={[styles.avatarLarge, isLg && styles.avatarLargeDesktop]}>
                                    {tutor.photoUrl ? (
                                        <Image source={{ uri: tutor.photoUrl }} style={styles.avatarImg} />
                                    ) : (
                                        <Text style={styles.avatarInitial}>{tutor.fullName.charAt(0)}</Text>
                                    )}
                                </View>
                                <View style={styles.heroText}>
                                    <View style={styles.nameHeader}>
                                        <TouchableOpacity onPress={() => router.back()} style={styles.backFab}>
                                            <Ionicons name="arrow-back" size={20} color="#fff" />
                                        </TouchableOpacity>
                                        <Text style={[styles.fullName, isLg && styles.fullNameDesktop]}>{tutor.fullName}</Text>
                                        {(tutor.hasDbs || tutor.hasCertification) && (
                                            <View style={styles.verifiedBadge}>
                                                <Ionicons name="checkmark-circle" size={12} color="#fff" />
                                                <Text style={styles.verifiedText}>Verified</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.heroCategory}>{Category[tutor.category]}</Text>
                                    <View style={styles.heroRatingRow}>
                                        <Ionicons name="star" size={16} color={colors.ratingStars} />
                                        <Text style={styles.ratingValue}>{tutor.averageRating.toFixed(1)}</Text>
                                        <Text style={styles.reviewCount}>({tutor.reviewCount} reviews)</Text>
                                    </View>
                                </View>
                            </View>

                            {isLg && (
                                <View style={styles.heroPriceSection}>
                                    <Text style={styles.heroPrice}>£{tutor.pricePerHour}<Text style={styles.heroPriceUnit}>/hr</Text></Text>
                                    <Button title={bookingCta.title} onPress={bookingCta.onPress} isLoading={isBookingPending} size="lg" style={styles.heroBtn} />
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={[styles.bodyLayout, isLg && styles.bodyLayoutWide, { paddingHorizontal: horizontalPadding }]}>
                        <View style={styles.contentColumn}>
                            {infoSections.map((section) => (
                                <InfoSection key={section.title} section={section} />
                            ))}

                            <View style={styles.reviewsHeader}>
                                <Text style={styles.reviewSectionTitle}>Student Reviews</Text>
                                <ReviewList
                                    reviews={tutor.reviews ?? []}
                                    averageRating={tutor.averageRating}
                                    totalCount={tutor.reviewCount}
                                    ratingBreakdown={tutor.ratingBreakdown}
                                    sort={reviewSort}
                                    onSortChange={setReviewSort}
                                />
                            </View>
                        </View>

                        <View style={[styles.bookingColumn, isLg && styles.bookingSticky]}>
                            {activeBooking ? (
                                <View style={styles.bookingStatusCard}>
                                    <View style={styles.bookingStatusTop}>
                                        <Text style={styles.bookingStatusLabel}>Current Booking</Text>
                                        {!!bookingCta.badge && (
                                            <View style={styles.bookingStatusBadge}>
                                                <Text style={styles.bookingStatusBadgeText}>{bookingCta.badge.toUpperCase()}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.bookingStatusHint}>Message this tutor directly from your active booking.</Text>
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
                                    availabilitySlots={tutor.availabilitySlots}
                                    onSelectFromSchedule={() => setScheduleModalOpen(true)}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {!isLg && (
                <View style={styles.mobileBookingBar}>
                    <View>
                        <Text style={styles.mobilePrice}>£{tutor.pricePerHour}<Text style={styles.mobilePriceUnit}>/hr</Text></Text>
                        <Text style={styles.mobilePriceCaption}>Secure payment</Text>
                    </View>
                    <Button title={bookingCta.title} onPress={bookingCta.onPress} isLoading={isBookingPending} style={styles.mobileBookingBtn} />
                </View>
            )}

            <Modal visible={bookingModalOpen} animationType="slide" onRequestClose={() => setBookingModalOpen(false)}>
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutrals.background }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Request a Session</Text>
                        <TouchableOpacity onPress={() => setBookingModalOpen(false)} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={colors.neutrals.textMuted} />
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
                            availabilitySlots={tutor.availabilitySlots}
                            onSelectFromSchedule={() => setScheduleModalOpen(true)}
                        />
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <SchedulePickerModal
                visible={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                slots={tutor.availabilitySlots || []}
                onSelect={handleSlotSelect}
            />
        </SafeAreaView>
    );
}

function InfoSection({ section }: { section: any }) {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
                <View style={styles.iconCircle}>
                    <Ionicons name={(section.icon + '-outline') as any} size={20} color={colors.primaryDark} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {section.body && <Text style={[styles.sectionBody, section.slots && { marginBottom: spacing.md }]}>{section.body}</Text>}

            {section.title === 'Availability' && section.slots && (
                <AvailabilitySchedule slots={section.slots} />
            )}

            {section.isChecklist && (
                <View style={[styles.checklist, { marginTop: spacing.sm }]}>
                    {section.items.map((item: string, idx: number) => (
                        <View key={idx} style={styles.checkItem}>
                            <Ionicons name="checkmark-circle-sharp" size={18} color={colors.success} />
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
    scrollContent: {
        paddingBottom: spacing['4xl'],
    },
    pageContent: {
        width: '100%',
        alignItems: 'center',
    },
    heroSection: {
        width: '100%',
        height: 280,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    heroBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    heroBlur: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    heroContent: {
        maxWidth: layout.wideContentMaxWidth,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    profileHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 24,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 4,
        borderColor: '#fff',
        overflow: 'hidden',
        ...shadows.lg,
    },
    avatarLargeDesktop: {
        width: 140,
        height: 140,
        borderRadius: 32,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 40,
        fontWeight: typography.fontWeight.heavy,
        color: colors.primaryDark,
        lineHeight: 100,
        textAlign: 'center',
    },
    heroText: {
        gap: 4,
    },
    nameHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    backFab: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
        ...Platform.select({ web: { display: 'none' } as any }),
    },
    fullName: {
        fontSize: 32,
        fontWeight: typography.fontWeight.heavy,
        color: '#fff',
    },
    fullNameDesktop: {
        fontSize: 44,
    },
    heroCategory: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: typography.fontWeight.semibold,
    },
    heroRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: 4,
    },
    ratingValue: {
        fontSize: 16,
        fontWeight: typography.fontWeight.bold,
        color: '#fff',
    },
    reviewCount: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    heroPriceSection: {
        alignItems: 'flex-end',
        gap: spacing.md,
    },
    heroPrice: {
        fontSize: 36,
        fontWeight: typography.fontWeight.heavy,
        color: '#fff',
    },
    heroPriceUnit: {
        fontSize: 16,
        fontWeight: typography.fontWeight.normal,
    },
    heroBtn: {
        backgroundColor: '#fff',
        borderColor: '#fff',
        paddingHorizontal: spacing.xl,
    },
    bodyLayout: {
        width: '100%',
        maxWidth: layout.wideContentMaxWidth,
        marginTop: spacing.xl,
        gap: spacing.xl,
    },
    bodyLayoutWide: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    contentColumn: {
        flex: 1.2,
        gap: spacing.lg,
    },
    bookingColumn: {
        flex: 0.8,
        maxWidth: 420,
        width: '100%',
    },
    bookingSticky: {
        position: 'sticky' as any,
        top: spacing.lg,
    },
    sectionCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 24,
        padding: spacing.xl,
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
        borderRadius: 12,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    sectionBody: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        lineHeight: 26,
    },
    checklist: {
        gap: 12,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkText: {
        fontSize: 15,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    specialtyPill: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: colors.primarySoft,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    specialtyText: {
        color: colors.primaryDark,
        fontSize: 13,
        fontWeight: typography.fontWeight.bold,
    },
    reviewsHeader: {
        marginTop: spacing.xl,
    },
    reviewSectionTitle: {
        fontSize: 22,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.lg,
    },
    bookingStatusCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 24,
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
        fontSize: 12,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bookingStatusBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    bookingStatusBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    bookingStatusHint: {
        fontSize: 14,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
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
        fontSize: 24,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
    },
    mobilePriceUnit: {
        fontSize: 14,
        fontWeight: typography.fontWeight.normal,
        color: colors.neutrals.textMuted,
    },
    mobilePriceCaption: {
        fontSize: 12,
        color: colors.success,
        fontWeight: 'bold',
    },
    mobileBookingBtn: {
        minWidth: 160,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.success,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    verifiedText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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
        fontSize: 20,
        fontWeight: typography.fontWeight.bold,
    },
    closeBtn: {
        padding: 4,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: colors.error,
        fontSize: 16,
    },
});

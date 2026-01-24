import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Platform, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTutorProfile } from '../../src/hooks/useTutors';
import { useCreateBooking, useMyBookings } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { useNotificationStore } from '../../src/store/notificationStore';
import {
    BookingPanel, ReviewList, AvailabilitySchedule, SchedulePickerModal,
    Text, ErrorState, Screen, Container, Section, Spacer, Button, IconButton, Card, Badge
} from '../../src/components';
import { colors, spacing, layout, shadows, borderRadius, typography } from '../../src/lib/theme';
import { BookingStatus, TeachingMode } from '../../src/types';
import { useBreakpoint } from '../../src/lib/responsive';
import { Ionicons } from '@expo/vector-icons';

export default function TutorDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const notify = useNotificationStore((s) => s.addToast);

    const { data: tutor, isLoading, isError } = useTutorProfile(id!);
    const { data: myBookings } = useMyBookings(isAuthenticated);
    const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();
    const { isLg } = useBreakpoint();

    const [initialMessage, setInitialMessage] = useState('');
    const [preferredMode, setPreferredMode] = useState<TeachingMode>(TeachingMode.Both);
    const [preferredDate, setPreferredDate] = useState('');
    const [reviewSort, setReviewSort] = useState<'recent' | 'highest'>('recent');
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

    const activeBooking = useMemo(() => {
        const list = Array.isArray(myBookings) ? myBookings : [];
        return list.find((b) => b.tutorId === id && b.status !== BookingStatus.Declined);
    }, [id, myBookings]);

    const handleBooking = () => {
        if (!isAuthenticated) {
            router.push('/(auth)/login');
            return;
        }
        if (activeBooking) {
            notify({ type: 'info', title: 'Existing booking', message: 'You already have an active request.' });
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
                    router.push(`/booking/${booking.id}`);
                },
            }
        );
    };

    if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
    if (isError || !tutor) return <ErrorState title="Profile not found" onRetry={() => router.back()} />;

    return (
        <Screen scrollable backgroundColor={colors.neutrals.background}>
            {/* World Class Header / Hero */}
            <View style={styles.header}>
                <Container maxWidth={layout.contentMaxWidth} padding="lg">
                    <View style={styles.headerToolbar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="chevron-back" size={24} color={colors.neutrals.textPrimary} />
                            <Text weight="bold" style={{ marginLeft: 4 }}>Back</Text>
                        </TouchableOpacity>
                        <View style={styles.toolbarActions}>
                            <IconButton icon={<Ionicons name="share-outline" size={20} />} onPress={() => { }} />
                            <IconButton icon={<Ionicons name="heart-outline" size={20} />} onPress={() => { }} />
                        </View>
                    </View>

                    <View style={[styles.profileHero, isLg && styles.profileHeroWeb]}>
                        <View style={styles.avatarContainer}>
                            {tutor.photoUrl ? (
                                <Image source={{ uri: tutor.photoUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarFallback}>
                                    <Text variant="h1" weight="heavy" color={colors.primary}>
                                        {tutor.fullName.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.onlineStatus} />
                        </View>

                        <View style={styles.heroMain}>
                            <View style={styles.nameSection}>
                                <Text variant="h1" weight="heavy" style={styles.profileName}>{tutor.fullName}</Text>
                                {tutor.hasDbs && (
                                    <View style={styles.verifiedChip}>
                                        <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                                        <Text variant="caption" weight="heavy" color={colors.success} style={{ marginLeft: 4 }}>DBS Checked</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.subjectRow}>
                                {tutor.subjects?.map((sub) => (
                                    <View key={sub} style={styles.subjectChip}>
                                        <Text variant="caption" weight="heavy" color={colors.primary}>{sub}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.metaRow}>
                                <View style={styles.ratingBox}>
                                    <Ionicons name="star" size={18} color={colors.ratingStars} />
                                    <Text weight="heavy" style={{ fontSize: 16, marginLeft: 6 }}>{tutor.averageRating.toFixed(1)}</Text>
                                    <Text variant="bodySmall" color={colors.neutrals.textMuted} style={{ marginLeft: 4 }}>({tutor.reviewCount} reviews)</Text>
                                </View>
                                <View style={styles.dot} />
                                <View style={styles.locationBox}>
                                    <Ionicons name="location-sharp" size={16} color={colors.neutrals.textSecondary} />
                                    <Text variant="bodySmall" color={colors.neutrals.textSecondary} style={{ marginLeft: 4 }}>
                                        {tutor.postcode ? `London ${tutor.postcode.substring(0, 3)}` : 'London, UK'}
                                    </Text>
                                </View>
                                <View style={styles.dot} />
                                <View style={styles.responseBox}>
                                    <Ionicons name="flash" size={14} color={colors.success} />
                                    <Text variant="bodySmall" weight="bold" color={colors.success} style={{ marginLeft: 4 }}>Typically responds in 2h</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Container>
            </View>

            {/* Profile Content Layout */}
            <Container maxWidth={layout.contentMaxWidth} padding="lg">
                <View style={[styles.mainLayout, isLg && styles.mainLayoutWeb]}>
                    {/* Left Column: Information Sections */}
                    <View style={styles.contentColumn}>
                        <Section paddingVertical="xl">
                            <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Meet Your Tutor</Text>
                            <Card variant="subtle" style={styles.infoCard}>
                                <Text variant="body" color={colors.neutrals.textSecondary} style={styles.bioText}>
                                    {tutor.bio || 'Qualified tutor with over 5 years of experience in helping students reach their full potential.'}
                                </Text>
                            </Card>
                        </Section>

                        <Section paddingVertical="md">
                            <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Teaching Methodology</Text>
                            <Card variant="subtle" style={styles.infoCard}>
                                <Text variant="body" color={colors.neutrals.textSecondary} style={styles.bioText}>
                                    {tutor.teachingStyle || 'I believe in a personalized approach that builds core confidence, making complex concepts easy to digest.'}
                                </Text>
                            </Card>
                        </Section>

                        {/* Trust & Safety Section */}
                        <Section paddingVertical="md">
                            <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Trust & Safety</Text>
                            <Card variant="subtle" style={styles.infoCard}>
                                <View style={styles.trustItems}>
                                    <View style={styles.trustItem}>
                                        <View style={[styles.trustBadge, tutor.hasDbs && styles.trustBadgeActive]}>
                                            <Ionicons
                                                name="shield-checkmark"
                                                size={20}
                                                color={tutor.hasDbs ? colors.trust.dbs : colors.neutrals.textMuted}
                                            />
                                        </View>
                                        <View style={styles.trustText}>
                                            <Text variant="body" weight="semibold">
                                                DBS Check {tutor.hasDbs ? '(Declared)' : 'Not Declared'}
                                            </Text>
                                            <Text variant="caption" color={colors.neutrals.textMuted}>
                                                {tutor.hasDbs
                                                    ? 'This tutor has declared they hold a valid DBS certificate.'
                                                    : 'DBS status has not been declared by this tutor.'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.trustDivider} />

                                    <View style={styles.trustItem}>
                                        <View style={[styles.trustBadge, tutor.hasCertification && styles.trustBadgeActive]}>
                                            <Ionicons
                                                name="ribbon"
                                                size={20}
                                                color={tutor.hasCertification ? colors.trust.certified : colors.neutrals.textMuted}
                                            />
                                        </View>
                                        <View style={styles.trustText}>
                                            <Text variant="body" weight="semibold">
                                                {tutor.hasCertification ? 'Qualified Teacher' : 'Qualifications Not Declared'}
                                            </Text>
                                            <Text variant="caption" color={colors.neutrals.textMuted}>
                                                {tutor.hasCertification
                                                    ? 'This tutor has declared they are a qualified teacher or hold relevant certifications.'
                                                    : 'Teaching qualifications have not been declared.'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.reportConcern}>
                                    <TouchableOpacity
                                        style={styles.reportLink}
                                        onPress={() => router.push({
                                            pathname: '/profile/report' as any,
                                            params: { tutorId: tutor.id, name: tutor.fullName }
                                        })}
                                    >
                                        <Ionicons name="flag-outline" size={16} color={colors.neutrals.textMuted} />
                                        <Text variant="caption" color={colors.neutrals.textMuted} style={{ marginLeft: 6 }}>
                                            Report a concern
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </Section>

                        <Section paddingVertical="md">
                            <View style={styles.sectionHeaderRow}>
                                <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Habitual Availability</Text>
                                <TouchableOpacity onPress={() => setScheduleModalOpen(true)}>
                                    <Text variant="bodySmall" color={colors.primary} weight="heavy">View Full Schedule</Text>
                                </TouchableOpacity>
                            </View>
                            <Spacer size="md" />
                            <AvailabilitySchedule slots={tutor.availabilitySlots || []} />
                        </Section>

                        <Section paddingVertical="xl">
                            <View style={styles.sectionHeaderRow}>
                                <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Student Reviews</Text>
                                <View style={styles.reviewSummary}>
                                    <Ionicons name="star" size={14} color={colors.ratingStars} />
                                    <Text weight="heavy" style={{ marginLeft: 4 }}>{tutor.averageRating.toFixed(1)}</Text>
                                </View>
                            </View>
                            <Spacer size="lg" />
                            <ReviewList
                                reviews={tutor.reviews ?? []}
                                averageRating={tutor.averageRating}
                                totalCount={tutor.reviewCount}
                                sort={reviewSort}
                                onSortChange={setReviewSort}
                            />
                        </Section>
                    </View>

                    {/* Column 2: Sticky Sidebar (Web) */}
                    {isLg && (
                        <View style={styles.sidebar}>
                            <View style={styles.sidebarSticky}>
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
                                    availabilitySlots={tutor.availabilitySlots}
                                    onSelectFromSchedule={() => setScheduleModalOpen(true)}
                                />
                                <View style={styles.trustFooter}>
                                    <Ionicons name="lock-closed" size={14} color={colors.neutrals.textMuted} />
                                    <Text variant="caption" color={colors.neutrals.textMuted} style={{ marginLeft: 6 }}>
                                        Arrange payment directly with the tutor.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </Container>

            {/* Mobile Bottom Booking Bar */}
            {!isLg && (
                <View style={styles.mobileActions}>
                    <View style={styles.mobilePriceInfo}>
                        <Text variant="h2" weight="heavy">£{tutor.pricePerHour}<Text variant="caption">/hr</Text></Text>
                        <Text variant="caption" color={colors.neutrals.textMuted}>Contact to arrange lesson</Text>
                    </View>
                    <Button
                        title={activeBooking ? 'Manage Booking' : 'Book Session'}
                        onPress={() => setBookingModalOpen(true)}
                        variant="primary"
                        style={styles.mobileBookBtn}
                        size="lg"
                    />
                </View>
            )}

            {/* Mobile Booking Overlay */}
            <Modal visible={bookingModalOpen && !isLg} animationType="slide">
                <Screen edges={['top', 'bottom']} backgroundColor={colors.neutrals.background}>
                    <Container padding="lg">
                        <View style={styles.modalHeader}>
                            <View>
                                <Text variant="h3" weight="heavy">Secure Booking</Text>
                                <Text variant="caption" color={colors.neutrals.textMuted}>Sending request to {tutor.fullName.split(' ')[0]}</Text>
                            </View>
                            <TouchableOpacity style={styles.modalClose} onPress={() => setBookingModalOpen(false)}>
                                <Ionicons name="close" size={24} color={colors.neutrals.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <Spacer size="xl" />
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
                            availabilitySlots={tutor.availabilitySlots}
                        />
                    </Container>
                </Screen>
            </Modal>

            <SchedulePickerModal
                visible={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                slots={tutor.availabilitySlots || []}
                onSelect={(d, t) => {
                    setPreferredDate(`${d} at ${t.substring(0, 5)}`);
                    setScheduleModalOpen(false);
                }}
            />
            <Spacer size="5xl" />
        </Screen>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        backgroundColor: colors.neutrals.surface,
        paddingTop: spacing.lg,
        paddingBottom: spacing['2xl'],
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
    },
    headerToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    toolbarActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    profileHero: {
        alignItems: 'center',
        gap: spacing.xl,
    },
    profileHeroWeb: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        textAlign: 'left',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 24,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderWidth: 6,
        borderColor: '#fff',
        ...shadows.lg,
    },
    avatarFallback: {
        width: 160,
        height: 160,
        borderRadius: 24,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: '#fff',
        ...shadows.lg,
    },
    onlineStatus: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.success,
        borderWidth: 5,
        borderColor: '#fff',
        ...shadows.sm,
    },
    heroMain: {
        flex: 1,
        alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
    },
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
        gap: 12,
        marginBottom: 8,
    },
    profileName: {
        letterSpacing: -1,
    },
    verifiedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    subjectRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: 16,
        justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center',
    },
    subjectChip: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    topSubject: {
        marginBottom: 12,
        fontSize: 18,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    responseBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.neutrals.borderAlt,
        marginHorizontal: spacing.lg,
    },
    mainLayout: {
        paddingVertical: spacing.xl,
        gap: spacing['2xl'],
    },
    mainLayoutWeb: {
        flexDirection: 'row',
    },
    contentColumn: {
        flex: 1,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    infoCard: {
        padding: spacing.xl,
        borderRadius: 20,
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    bioText: {
        lineHeight: 26,
        fontSize: 16,
    },
    reviewSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sidebar: {
        width: 400,
    },
    sidebarSticky: {
        ...Platform.select({
            web: {
                position: 'sticky' as any,
                top: spacing.xl,
            }
        })
    },
    trustFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    mobileActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        backgroundColor: colors.neutrals.surface,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
        ...shadows.lg,
        zIndex: 50,
    },
    mobilePriceInfo: {
        flex: 1,
    },
    mobileBookBtn: {
        flex: 1.2,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    modalClose: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Trust & Safety styles
    trustItems: {
        gap: spacing.lg,
    },
    trustItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    trustBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trustBadgeActive: {
        backgroundColor: colors.trust.dbsLight,
    },
    trustText: {
        flex: 1,
        gap: 2,
    },
    trustDivider: {
        height: 1,
        backgroundColor: colors.neutrals.border,
        marginVertical: spacing.xs,
    },
    reportConcern: {
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
    },
    reportLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTutorProfile } from '../../src/hooks/useTutors';
import { useCreateBooking } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { Button, Input } from '../../src/components';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { Category, TeachingMode } from '../../src/types';

export default function TutorDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { data: tutor, isLoading, isError } = useTutorProfile(id!);
    const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();

    const [initialMessage, setInitialMessage] = useState('');
    const [preferredMode, setPreferredMode] = useState<TeachingMode>(TeachingMode.Online);

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
                initialMessage: initialMessage.trim(),
            },
            {
                onSuccess: (data: any) => {
                    Alert.alert('Request Sent', 'Your booking request has been sent to the tutor.', [
                        { text: 'View Bookings', onPress: () => router.push('/bookings') },
                        { text: 'OK' }
                    ]);
                    setInitialMessage('');
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

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerCard}>
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
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>£{tutor.pricePerHour}</Text>
                            <Text style={styles.statLabel}>per hour</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{tutor.subjects.length}</Text>
                            <Text style={styles.statLabel}>subjects</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {tutor.teachingMode === TeachingMode.Both ? 'Flexible' : TeachingMode[tutor.teachingMode]}
                            </Text>
                            <Text style={styles.statLabel}>mode</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About Me</Text>
                    <Text style={styles.bioText}>{tutor.bio}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subjects</Text>
                    <View style={styles.subjectsContainer}>
                        {tutor.subjects.map((subject: string, idx: number) => (
                            <View key={idx} style={styles.subjectChip}>
                                <Text style={styles.subjectChipText}>{subject}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.bookingCard}>
                    <Text style={styles.bookingTitle}>Request a Lesson</Text>

                    <Text style={styles.label}>Teaching Mode</Text>
                    <View style={styles.modeButtons}>
                        <TouchableOpacity
                            style={[styles.modeBtn, preferredMode === TeachingMode.Online && styles.modeBtnActive]}
                            onPress={() => setPreferredMode(TeachingMode.Online)}
                        >
                            <Text style={[styles.modeBtnText, preferredMode === TeachingMode.Online && styles.modeBtnTextActive]}>
                                Online
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeBtn, preferredMode === TeachingMode.InPerson && styles.modeBtnActive]}
                            onPress={() => setPreferredMode(TeachingMode.InPerson)}
                        >
                            <Text style={[styles.modeBtnText, preferredMode === TeachingMode.InPerson && styles.modeBtnTextActive]}>
                                In Person
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Input
                        label="Initial Message"
                        placeholder="Tell the tutor what you're looking for..."
                        value={initialMessage}
                        onChangeText={setInitialMessage}
                        multiline
                        numberOfLines={4}
                        style={styles.messageInput}
                    />

                    <Button
                        title={isAuthenticated ? "Send Request" : "Sign In to Book"}
                        onPress={handleBooking}
                        isLoading={isBookingPending}
                        fullWidth
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    headerCard: {
        backgroundColor: colors.neutrals.background,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    avatarInitial: {
        fontSize: 32,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.background,
    },
    nameSection: {
        flex: 1,
    },
    fullName: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    categoryText: {
        fontSize: typography.fontSize.base,
        color: colors.primary,
        fontWeight: typography.fontWeight.medium,
        marginVertical: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingStars: {
        color: colors.ratingStars,
        fontSize: typography.fontSize.lg,
    },
    reviewCount: {
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
        paddingTop: spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    statLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.neutrals.border,
    },
    section: {
        backgroundColor: colors.neutrals.background,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.md,
    },
    bioText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        lineHeight: 24,
    },
    subjectsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    subjectChip: {
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    subjectChipText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    bookingCard: {
        backgroundColor: colors.neutrals.background,
        padding: spacing.lg,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.lg,
        marginBottom: spacing.md,
    },
    bookingTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.sm,
    },
    modeButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    modeBtn: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        alignItems: 'center',
    },
    modeBtnActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    modeBtnText: {
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textSecondary,
    },
    modeBtnTextActive: {
        color: colors.primary,
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: spacing.sm,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
    },
});

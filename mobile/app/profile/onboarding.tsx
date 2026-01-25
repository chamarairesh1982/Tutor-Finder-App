import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button, Text, Section, Card, Spacer } from '../../src/components';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { useMyTutorProfile, useUpdateTutorProfile } from '../../src/hooks/useTutors';
import { Category, TeachingMode, AvailabilitySlot } from '../../src/types';
import { useNotificationStore } from '../../src/store/notificationStore';

const steps = [
    { title: 'Identity', icon: 'person-outline' },
    { title: 'Expertise', icon: 'school-outline' },
    { title: 'Logistics', icon: 'navigate-outline' },
    { title: 'Schedule', icon: 'calendar-outline' },
    { title: 'Trust', icon: 'shield-checkmark-outline' }
];

const categoryOptions = [
    { label: 'Music', value: Category.Music, color: '#8B5CF6' },
    { label: 'Maths', value: Category.Maths, color: '#EC4899' },
    { label: 'Science', value: Category.Science, color: '#10B981' },
    { label: 'English', value: Category.English, color: '#3B82F6' },
    { label: 'Programming', value: Category.Programming, color: '#6366F1' },
    { label: 'Other', value: Category.Other, color: '#64748B' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TutorOnboardingScreen() {
    const router = useRouter();
    const notify = useNotificationStore(s => s.addToast);
    const { data: profile, isLoading } = useMyTutorProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateTutorProfile();

    const [currentStep, setCurrentStep] = useState(0);
    const [form, setForm] = useState({
        fullName: '',
        photoUrl: '',
        bio: '',
        category: Category.Music,
        pricePerHour: '25',
        teachingMode: TeachingMode.Both,
        postcode: '',
        travelRadiusMiles: '10',
        subjects: [] as string[],
        hasDbs: false,
        hasCertification: false,
        availability: [] as { dayOfWeek: number; startTime: string; endTime: string }[],
        baseLatitude: 0,
        baseLongitude: 0,
    });

    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        if (profile) {
            setForm({
                fullName: profile.fullName || '',
                photoUrl: profile.photoUrl || '',
                bio: profile.bio || '',
                category: profile.category ?? Category.Music,
                pricePerHour: profile.pricePerHour?.toString() || '25',
                teachingMode: profile.teachingMode ?? TeachingMode.Both,
                postcode: profile.postcode || '',
                travelRadiusMiles: profile.travelRadiusMiles?.toString() || '10',
                subjects: profile.subjects || [],
                hasDbs: profile.hasDbs || false,
                hasCertification: profile.hasCertification || false,
                availability: profile.availabilitySlots?.map((s: any) => ({
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime.substring(0, 5),
                    endTime: s.endTime.substring(0, 5)
                })) || [],
                baseLatitude: profile.baseLatitude || 0,
                baseLongitude: profile.baseLongitude || 0,
            });
        }
    }, [profile]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitForm();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const submitForm = () => {
        if (!form.fullName.trim()) {
            notify({ type: 'error', title: 'Missing Info', message: 'Please provide your full name.' });
            setCurrentStep(0);
            return;
        }

        updateProfile({
            ...form,
            pricePerHour: parseFloat(form.pricePerHour) || 0,
            travelRadiusMiles: parseInt(form.travelRadiusMiles) || 0,
            availability: form.availability.map(slot => ({
                ...slot,
                startTime: `${slot.startTime}:00`,
                endTime: `${slot.endTime}:00`
            }))
        }, {
            onSuccess: () => {
                notify({ type: 'success', title: 'Profile Ready!', message: 'Your tutor profile is now live.' });
                router.replace('/profile/dashboard');
            },
            onError: (err: any) => {
                const msg = err?.response?.data?.detail || 'Failed to update profile.';
                notify({ type: 'error', title: 'Submission Error', message: msg });
            }
        });
    };

    if (isLoading) return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Success/Progress Header */}
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    {steps.map((_, idx) => (
                        <View key={idx} style={[
                            styles.progressBar,
                            { backgroundColor: idx <= currentStep ? colors.primary : colors.neutrals.border },
                            idx === currentStep && styles.progressBarActive
                        ]} />
                    ))}
                </View>
                <View style={styles.headerInfo}>
                    <Text variant="h2" weight="heavy">{steps[currentStep].title}</Text>
                    <Text variant="caption" color={colors.neutrals.textMuted}>Step {currentStep + 1} of {steps.length}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {currentStep === 0 && (
                    <Animated.View style={styles.stepContainer}>
                        <View style={styles.illustrationWrap}>
                            <View style={styles.avatarLarge}>
                                {form.photoUrl ? (
                                    <View style={{ width: '100%', height: '100%', borderRadius: 100, overflow: 'hidden' }} />
                                ) : (
                                    <Ionicons name="person" size={40} color={colors.primary} />
                                )}
                            </View>
                            <TouchableOpacity style={styles.editBtn}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Input
                            label="Professional Name"
                            value={form.fullName}
                            onChangeText={v => setForm({ ...form, fullName: v })}
                            placeholder="e.g. Dr. Robert Miller"
                        />
                        <Input
                            label="Introduction"
                            value={form.bio}
                            onChangeText={v => setForm({ ...form, bio: v })}
                            placeholder="Share your teaching philosophy and experience..."
                            multiline
                            numberOfLines={5}
                            style={{ height: 120, textAlignVertical: 'top' }}
                        />
                        <Input
                            label="Photo URL (Optional)"
                            value={form.photoUrl}
                            onChangeText={v => setForm({ ...form, photoUrl: v })}
                            placeholder="https://example.com/photo.jpg"
                        />
                    </Animated.View>
                )}

                {currentStep === 1 && (
                    <Animated.View style={styles.stepContainer}>
                        <Text variant="label" weight="bold" style={{ marginBottom: spacing.md }}>Main Expertise</Text>
                        <View style={styles.categoryGrid}>
                            {categoryOptions.map(opt => {
                                const active = form.category === opt.value;
                                return (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={[styles.catCard, active && { borderColor: opt.color, backgroundColor: opt.color + '10' }]}
                                        onPress={() => setForm({ ...form, category: opt.value })}
                                    >
                                        <View style={[styles.catIcon, { backgroundColor: opt.color + '15' }]}>
                                            <Ionicons name="sparkles" size={18} color={opt.color} />
                                        </View>
                                        <Text variant="caption" weight="heavy" color={active ? opt.color : colors.neutrals.textPrimary}>{opt.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text variant="label" weight="bold" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>Specific Subjects</Text>
                        <View style={styles.tagInputRow}>
                            <Input
                                placeholder="e.g. Physics, Piano, Spanish"
                                value={newSubject}
                                onChangeText={setNewSubject}
                                style={{ flex: 1 }}
                            />
                            <TouchableOpacity
                                style={styles.addTagBtn}
                                onPress={() => {
                                    if (!newSubject.trim()) return;
                                    setForm({ ...form, subjects: [...form.subjects, newSubject.trim()] });
                                    setNewSubject('');
                                }}
                            >
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tagWrap}>
                            {form.subjects.map(s => (
                                <View key={s} style={styles.tag}>
                                    <Text variant="caption" weight="bold">{s}</Text>
                                    <TouchableOpacity onPress={() => setForm({ ...form, subjects: form.subjects.filter(x => x !== s) })}>
                                        <Ionicons name="close-circle" size={16} color={colors.neutrals.textMuted} style={{ marginLeft: 6 }} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                )}

                {currentStep === 2 && (
                    <Animated.View style={styles.stepContainer}>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Input
                                    label="Hourly Rate (£)"
                                    value={form.pricePerHour}
                                    onChangeText={v => setForm({ ...form, pricePerHour: v })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Spacer size="md" horizontal />
                            <View style={{ flex: 1 }}>
                                <Input
                                    label="Travel Radius (mi)"
                                    value={form.travelRadiusMiles}
                                    onChangeText={v => setForm({ ...form, travelRadiusMiles: v })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <Input
                            label="Home Postcode"
                            value={form.postcode}
                            onChangeText={v => setForm({ ...form, postcode: v.toUpperCase() })}
                            placeholder="e.g. SW1A 1AA"
                            autoCapitalize="characters"
                        />

                        <Text variant="label" weight="bold" style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>Teaching Mode</Text>
                        <View style={styles.modeRow}>
                            {[
                                { label: 'In-person', val: TeachingMode.InPerson, icon: 'people-outline' },
                                { label: 'Online', val: TeachingMode.Online, icon: 'videocam-outline' },
                                { label: 'Both', val: TeachingMode.Both, icon: 'layers-outline' }
                            ].map(opt => (
                                <TouchableOpacity
                                    key={opt.val}
                                    style={[styles.modeBtn, form.teachingMode === opt.val && styles.modeBtnActive]}
                                    onPress={() => setForm({ ...form, teachingMode: opt.val })}
                                >
                                    <Ionicons name={opt.icon as any} size={20} color={form.teachingMode === opt.val ? '#fff' : colors.primary} />
                                    <Text variant="caption" weight="heavy" color={form.teachingMode === opt.val ? '#fff' : colors.neutrals.textPrimary} style={{ marginTop: 4 }}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                )}

                {currentStep === 3 && (
                    <Animated.View style={styles.stepContainer}>
                        <View style={styles.rowBetween}>
                            <Text variant="bodyLarge" weight="heavy">Your Availability</Text>
                            <TouchableOpacity
                                onPress={() => setForm({ ...form, availability: [...form.availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }] })}
                            >
                                <Text variant="bodySmall" weight="heavy" color={colors.primary}>+ Add Slot</Text>
                            </TouchableOpacity>
                        </View>
                        <Spacer size="md" />
                        {form.availability.length === 0 ? (
                            <View style={styles.emptySlots}>
                                <Ionicons name="time-outline" size={40} color={colors.neutrals.border} />
                                <Text color={colors.neutrals.textMuted} align="center">Add your typical working hours to help students book you.</Text>
                            </View>
                        ) : (
                            form.availability.map((slot, idx) => (
                                <Card key={idx} style={styles.slotCard}>
                                    <View style={styles.slotTop}>
                                        <View style={styles.dayScroll}>
                                            {daysOfWeek.map((d, dIdx) => (
                                                <TouchableOpacity
                                                    key={d}
                                                    style={[styles.dayItem, slot.dayOfWeek === dIdx && styles.dayItemActive]}
                                                    onPress={() => {
                                                        const fresh = [...form.availability];
                                                        fresh[idx].dayOfWeek = dIdx;
                                                        setForm({ ...form, availability: fresh });
                                                    }}
                                                >
                                                    <Text variant="caption" weight="bold" color={slot.dayOfWeek === dIdx ? '#fff' : colors.neutrals.textMuted}>{d}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        <TouchableOpacity onPress={() => setForm({ ...form, availability: form.availability.filter((_, i) => i !== idx) })}>
                                            <Ionicons name="trash-outline" size={20} color={colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.slotTimeRow}>
                                        <View style={{ flex: 1 }}>
                                            <Input
                                                value={slot.startTime}
                                                onChangeText={v => {
                                                    const fresh = [...form.availability];
                                                    fresh[idx].startTime = v;
                                                    setForm({ ...form, availability: fresh });
                                                }}
                                                placeholder="09:00"
                                            />
                                        </View>
                                        <Text style={{ marginHorizontal: 12 }}>to</Text>
                                        <View style={{ flex: 1 }}>
                                            <Input
                                                value={slot.endTime}
                                                onChangeText={v => {
                                                    const fresh = [...form.availability];
                                                    fresh[idx].endTime = v;
                                                    setForm({ ...form, availability: fresh });
                                                }}
                                                placeholder="17:00"
                                            />
                                        </View>
                                    </View>
                                </Card>
                            ))
                        )}
                    </Animated.View>
                )}

                {currentStep === 4 && (
                    <Animated.View style={styles.stepContainer}>
                        <Text variant="bodyLarge" weight="heavy" style={{ marginBottom: spacing.md }}>Verification Settings</Text>
                        <Text variant="caption" color={colors.neutrals.textMuted}>
                            Declare your status. Dishonest claims lead to immediate profile suspension. Formal verification via documents is available in dashboard.
                        </Text>
                        <Spacer size="xl" />

                        <TouchableOpacity
                            style={[styles.trustCard, form.hasDbs && styles.trustCardActive]}
                            onPress={() => setForm({ ...form, hasDbs: !form.hasDbs })}
                        >
                            <View style={[styles.trustIconContainer, { backgroundColor: form.hasDbs ? colors.success + '20' : colors.neutrals.surfaceAlt }]}>
                                <Ionicons name="shield-checkmark" size={24} color={form.hasDbs ? colors.success : colors.neutrals.textMuted} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text variant="body" weight="heavy">Enhanced DBS Checked</Text>
                                <Text variant="caption" color={colors.neutrals.textSecondary}>I hold a current UK DBS certificate (Self-Declared)</Text>
                            </View>
                            <Ionicons name={form.hasDbs ? "checkmark-circle" : "ellipse-outline"} size={24} color={form.hasDbs ? colors.primary : colors.neutrals.border} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.trustCard, form.hasCertification && styles.trustCardActive]}
                            onPress={() => setForm({ ...form, hasCertification: !form.hasCertification })}
                        >
                            <View style={[styles.trustIconContainer, { backgroundColor: form.hasCertification ? colors.trust.certified + '20' : colors.neutrals.surfaceAlt }]}>
                                <Ionicons name="ribbon" size={24} color={form.hasCertification ? colors.trust.certified : colors.neutrals.textMuted} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text variant="body" weight="heavy">Professional Qualified</Text>
                                <Text variant="caption" color={colors.neutrals.textSecondary}>I have formal teaching status or industry credentials</Text>
                            </View>
                            <Ionicons name={form.hasCertification ? "checkmark-circle" : "ellipse-outline"} size={24} color={form.hasCertification ? colors.primary : colors.neutrals.border} />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                <Spacer size="3xl" />
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Back"
                    variant="ghost"
                    onPress={handleBack}
                    style={{ flex: 1 }}
                />
                <View style={{ width: spacing.md }} />
                <Button
                    title={currentStep === steps.length - 1 ? "Complete Profile" : "Continue"}
                    onPress={handleNext}
                    style={{ flex: 2 }}
                    isLoading={isUpdating}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    header: {
        padding: spacing.lg,
        paddingBottom: spacing.sm,
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: spacing.md,
    },
    progressBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    progressBarActive: {
        height: 6,
        marginTop: -1,
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    scrollContent: {
        padding: spacing.lg,
    },
    stepContainer: {
        gap: spacing.lg,
    },
    illustrationWrap: {
        alignItems: 'center',
        marginVertical: spacing.lg,
        position: 'relative',
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primaryLight,
    },
    editBtn: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    catCard: {
        width: '47%',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.neutrals.border,
        alignItems: 'center',
        gap: 8,
    },
    catIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagInputRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-end',
    },
    addTagBtn: {
        backgroundColor: colors.primary,
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    row: {
        flexDirection: 'row',
    },
    modeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    modeBtn: {
        flex: 1,
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        alignItems: 'center',
        backgroundColor: colors.neutrals.surface,
    },
    modeBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emptySlots: {
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.neutrals.border,
        borderRadius: 16,
    },
    slotCard: {
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    slotTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    dayScroll: {
        flexDirection: 'row',
        gap: 4,
    },
    dayItem: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    dayItemActive: {
        backgroundColor: colors.primary,
    },
    slotTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trustCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        backgroundColor: colors.neutrals.surface,
        marginBottom: spacing.md,
    },
    trustCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    trustIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
        backgroundColor: colors.neutrals.surface,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

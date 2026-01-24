import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button, Text, Section } from '../../src/components';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { useMyTutorProfile, useUpdateTutorProfile } from '../../src/hooks/useTutors';
import { Category, TeachingMode, AvailabilitySlot } from '../../src/types';

const categoryOptions = [
    { label: 'Music', value: Category.Music },
    { label: 'Maths', value: Category.Maths },
    { label: 'English', value: Category.English },
    { label: 'Science', value: Category.Science },
    { label: 'Languages', value: Category.Languages },
    { label: 'Programming', value: Category.Programming },
    { label: 'Other', value: Category.Other },
];

const modeOptions = [
    { label: 'In Person', value: TeachingMode.InPerson },
    { label: 'Online', value: TeachingMode.Online },
    { label: 'Both', value: TeachingMode.Both },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TutorSettingsScreen() {
    const router = useRouter();
    const { data: profile, isLoading } = useMyTutorProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateTutorProfile();

    const [form, setForm] = useState({
        fullName: '',
        photoUrl: '',
        bio: '',
        category: Category.Music,
        pricePerHour: '0',
        teachingMode: TeachingMode.Online,
        postcode: '',
        travelRadiusMiles: '10',
        subjects: [] as string[],
        hasDbs: false,
        hasCertification: false,
        availability: [] as { dayOfWeek: number; startTime: string; endTime: string }[],
        baseLatitude: 0,
        baseLongitude: 0
    });

    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        if (profile) {
            setForm({
                fullName: profile.fullName || '',
                photoUrl: profile.photoUrl || '',
                bio: profile.bio || '',
                category: profile.category ?? Category.Music,
                pricePerHour: profile.pricePerHour?.toString() || '0',
                teachingMode: profile.teachingMode ?? TeachingMode.Online,
                postcode: profile.postcode || '',
                travelRadiusMiles: profile.travelRadiusMiles?.toString() || '10',
                subjects: profile.subjects || [],
                hasDbs: profile.hasDbs || false,
                hasCertification: profile.hasCertification || false,
                availability: profile.availabilitySlots?.map((s: AvailabilitySlot) => ({
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime
                })) || [],
                baseLatitude: profile.baseLatitude || 0,
                baseLongitude: profile.baseLongitude || 0
            });
        }
    }, [profile]);

    const handleSave = () => {
        if (!form.fullName.trim() || !form.bio.trim()) {
            Alert.alert('Error', 'Full name and bio are required');
            return;
        }

        const formattedAvailability = form.availability.map(slot => ({
            ...slot,
            startTime: slot.startTime.length === 5 ? `${slot.startTime}:00` : slot.startTime,
            endTime: slot.endTime.length === 5 ? `${slot.endTime}:00` : slot.endTime,
        }));

        updateProfile({
            ...form,
            pricePerHour: parseFloat(form.pricePerHour) || 0,
            travelRadiusMiles: parseInt(form.travelRadiusMiles) || 0,
            availability: formattedAvailability
        }, {
            onSuccess: () => {
                Alert.alert('Success', 'Profile updated successfully');
                router.back();
            },
            onError: (error: any) => {
                Alert.alert('Error', error.response?.data?.detail || 'Failed to update profile');
            }
        });
    };

    const addSubject = () => {
        if (newSubject.trim() && !form.subjects.includes(newSubject.trim())) {
            setForm({ ...form, subjects: [...form.subjects, newSubject.trim()] });
            setNewSubject('');
        }
    };

    const removeSubject = (sub: string) => {
        setForm({ ...form, subjects: form.subjects.filter(s => s !== sub) });
    };

    const addAvailability = () => {
        setForm({
            ...form,
            availability: [...form.availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]
        });
    };

    const updateAvailability = (index: number, field: string, value: any) => {
        const newAvail = [...form.availability];
        newAvail[index] = { ...newAvail[index], [field]: value };
        setForm({ ...form, availability: newAvail });
    };

    const removeAvailability = (index: number) => {
        setForm({ ...form, availability: form.availability.filter((_, i) => i !== index) });
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.neutrals.textPrimary} />
                </TouchableOpacity>
                <Text variant="h3" weight="heavy">Tutor Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.introBox, { backgroundColor: colors.primarySoft }]}>
                    <Ionicons name="sparkles" size={24} color={colors.primary} style={{ marginBottom: 8 }} />
                    <Text variant="h3" weight="heavy" color={colors.primaryDark}>Grow Your Students</Text>
                    <Text variant="bodySmall" color={colors.primaryDark} style={{ lineHeight: 18, marginTop: 4 }}>
                        Tutors with complete bios and qualifications receive 3x more enquiries. Use the sections below to showcase your professional credentials.
                    </Text>
                </View>

                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={styles.sectionTitle}>General Information</Text>
                    <Input
                        label="Public Full Name"
                        value={form.fullName}
                        onChangeText={(val) => setForm({ ...form, fullName: val })}
                        placeholder="e.g. Dr. Jane Smith"
                    />
                    <Input
                        label="Profile Bio"
                        value={form.bio}
                        onChangeText={(val) => setForm({ ...form, bio: val })}
                        placeholder="Tell students about your experience..."
                        multiline
                        numberOfLines={4}
                        style={{ height: 100, textAlignVertical: 'top' }}
                    />
                    <Input
                        label="Photo URL"
                        value={form.photoUrl}
                        onChangeText={(val) => setForm({ ...form, photoUrl: val })}
                        placeholder="Link to your profile picture"
                    />
                </Section>

                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Main Category</Text>
                    <View style={styles.pickerRow}>
                        {categoryOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.pill, form.category === opt.value && styles.pillActive]}
                                onPress={() => setForm({ ...form, category: opt.value })}
                            >
                                <Text style={[styles.pillText, form.category === opt.value && styles.pillTextActive]}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Section>

                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Subjects</Text>
                    <View style={styles.tagInputRow}>
                        <Input
                            placeholder="Add a subject (e.g. Physics)"
                            value={newSubject}
                            onChangeText={setNewSubject}
                            style={{ flex: 1 }}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addSubject}>
                            <Ionicons name="add" size={24} color={colors.neutrals.background} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.tagContainer}>
                        {form.subjects.map((sub) => (
                            <View key={sub} style={styles.tag}>
                                <Text style={styles.tagText}>{sub}</Text>
                                <TouchableOpacity onPress={() => removeSubject(sub)}>
                                    <Ionicons name="close-circle" size={16} color={colors.neutrals.textMuted} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </Section>

                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Pricing & Delivery</Text>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Hourly Rate (£)"
                                value={form.pricePerHour}
                                onChangeText={(val) => setForm({ ...form, pricePerHour: val })}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ width: spacing.md }} />
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Travel Radius (mi)"
                                value={form.travelRadiusMiles}
                                onChangeText={(val) => setForm({ ...form, travelRadiusMiles: val })}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Text variant="bodySmall" weight="bold" color={colors.neutrals.textSecondary} style={{ marginTop: spacing.md, marginBottom: 8 }}>
                        Teaching Mode
                    </Text>
                    <View style={styles.pickerRow}>
                        {modeOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.pill, form.teachingMode === opt.value && styles.pillActive]}
                                onPress={() => setForm({ ...form, teachingMode: opt.value })}
                            >
                                <Text style={[styles.pillText, form.teachingMode === opt.value && styles.pillTextActive]}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Input
                        label="Postcode"
                        value={form.postcode}
                        onChangeText={(val) => setForm({ ...form, postcode: val })}
                        autoCapitalize="characters"
                    />
                </Section>

                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Trust & Verification</Text>
                    <Text variant="caption" color={colors.neutrals.textMuted} style={{ marginBottom: spacing.md }}>
                        These declarations are shown on your profile as "Self-Declared". Honest disclosure builds long-term trust with parents.
                    </Text>

                    <TouchableOpacity
                        style={[styles.toggleCard, form.hasDbs && styles.toggleCardActive]}
                        onPress={() => setForm({ ...form, hasDbs: !form.hasDbs })}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBadge, form.hasDbs && styles.iconBadgeActive]}>
                            <Ionicons name="shield-checkmark" size={20} color={form.hasDbs ? colors.trust.dbs : colors.neutrals.textMuted} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text variant="body" weight="semibold">DBS Checked (Self-Declared)</Text>
                            <Text variant="caption" color={colors.neutrals.textSecondary}>I hold a valid UK Disclosure and Barring Service certificate.</Text>
                        </View>
                        <Ionicons name={form.hasDbs ? "checkmark-circle" : "ellipse-outline"} size={24} color={form.hasDbs ? colors.primary : colors.neutrals.border} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toggleCard, form.hasCertification && styles.toggleCardActive]}
                        onPress={() => setForm({ ...form, hasCertification: !form.hasCertification })}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBadge, form.hasCertification && styles.iconBadgeActive]}>
                            <Ionicons name="ribbon" size={20} color={form.hasCertification ? colors.trust.certified : colors.neutrals.textMuted} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text variant="body" weight="semibold">Qualified Teacher</Text>
                            <Text variant="caption" color={colors.neutrals.textSecondary}>I have professional teaching status or equivalent certifications.</Text>
                        </View>
                        <Ionicons name={form.hasCertification ? "checkmark-circle" : "ellipse-outline"} size={24} color={form.hasCertification ? colors.primary : colors.neutrals.border} />
                    </TouchableOpacity>
                </Section>

                <Section paddingVertical="md">
                    <View style={styles.rowBetween}>
                        <Text variant="h3" weight="heavy" style={styles.sectionTitle}>Availability Slots</Text>
                        <TouchableOpacity onPress={addAvailability}>
                            <Text variant="bodySmall" weight="heavy" color={colors.primary}>+ Add Slot</Text>
                        </TouchableOpacity>
                    </View>
                    {form.availability.map((slot, idx) => (
                        <View key={idx} style={styles.slotCard}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker}>
                                {daysOfWeek.map((day, dIdx) => (
                                    <TouchableOpacity
                                        key={day}
                                        style={[styles.dayPill, slot.dayOfWeek === dIdx && styles.dayPillActive]}
                                        onPress={() => updateAvailability(idx, 'dayOfWeek', dIdx)}
                                    >
                                        <Text style={[styles.dayPillText, slot.dayOfWeek === dIdx && styles.dayPillTextActive]}>{day.substring(0, 3)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={styles.timeRow}>
                                <Input
                                    value={slot.startTime}
                                    onChangeText={(val) => updateAvailability(idx, 'startTime', val)}
                                    placeholder="09:00"
                                    style={{ flex: 1, height: 40 }}
                                />
                                <Text style={styles.timeTo}>to</Text>
                                <Input
                                    value={slot.endTime}
                                    onChangeText={(val) => updateAvailability(idx, 'endTime', val)}
                                    placeholder="17:00"
                                    style={{ flex: 1, height: 40 }}
                                />
                                <TouchableOpacity style={styles.deleteSlot} onPress={() => removeAvailability(idx)}>
                                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </Section>

                <Button
                    title="Save Tutor Profile"
                    onPress={handleSave}
                    isLoading={isUpdating}
                    style={styles.submitButton}
                />
                <View style={{ height: spacing['4xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
        gap: spacing.md,
    },
    backButton: {
        padding: spacing.xs,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    introBox: {
        backgroundColor: colors.primarySoft,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    addText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.sm,
    },
    pickerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    pill: {
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    pillActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    pillText: {
        fontSize: 13,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    pillTextActive: {
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.bold,
    },
    tagInputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'flex-end',
        marginBottom: spacing.sm,
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 44,
        height: 44, // Match input height roughly
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2, // Slight adjustment for label overhead
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    tagText: {
        fontSize: 12,
        color: colors.neutrals.textPrimary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    label: {
        fontSize: 14,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textSecondary,
        marginBottom: spacing.xs,
    },
    toggleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        backgroundColor: colors.neutrals.surface,
        marginBottom: spacing.sm,
    },
    toggleCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBadgeActive: {
        backgroundColor: '#fff',
    },
    toggleLabel: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
    },
    slotCard: {
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginTop: spacing.sm,
        gap: spacing.md,
    },
    dayPicker: {
        flexDirection: 'row',
    },
    dayPill: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        marginRight: 6,
        borderRadius: 4,
        backgroundColor: colors.neutrals.background,
    },
    dayPillActive: {
        backgroundColor: colors.primary,
    },
    dayPillText: {
        fontSize: 11,
        color: colors.neutrals.textSecondary,
    },
    dayPillTextActive: {
        color: colors.neutrals.background,
        fontWeight: typography.fontWeight.bold,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    timeTo: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
    },
    deleteSlot: {
        padding: spacing.xs,
    },
    submitButton: {
        marginTop: spacing.lg,
        ...shadows.md,
    }
});

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../src/lib/theme';
import { Text, Button, Screen, Container, Section, Spacer } from '../../src/components';

export default function ReportConcernScreen() {
    const router = useRouter();
    const { tutorId, bookingId, name } = useLocalSearchParams<{ tutorId?: string, bookingId?: string, name?: string }>();

    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reasons = [
        'Safety concern',
        'Inappropriate behaviour',
        'Inaccurate profile information',
        'Payment issues',
        'No-show / Cancellation issues',
        'Other'
    ];

    const handleSubmit = async () => {
        if (!reason) {
            Alert.alert('Error', 'Please select a reason for reporting.');
            return;
        }
        if (!details.trim()) {
            Alert.alert('Error', 'Please provide some details about your concern.');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call - In a real app this would go to a backend endpoint
        setTimeout(() => {
            setIsSubmitting(false);
            if (Platform.OS === 'web') {
                alert('Report Submitted. Thank you for reporting this concern. Our team will review it and take appropriate action.');
                router.back();
            } else {
                Alert.alert(
                    'Report Submitted',
                    'Thank you for reporting this concern. Our team will review it and take appropriate action.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }
        }, 1500);
    };

    return (
        <Screen edges={['top']} backgroundColor={colors.neutrals.background}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.primary} />
                    <Text weight="bold" style={{ color: colors.primary }}>Back</Text>
                </TouchableOpacity>
                <Text variant="h3" weight="heavy">Report a Concern</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Container>
                    <Section>
                        <Text variant="body" color={colors.neutrals.textSecondary}>
                            If you have a safeguarding concern or have experienced inappropriate behaviour, please let us know immediately. Your report is confidential.
                        </Text>
                        {name && (
                            <Text variant="bodySmall" weight="bold" style={{ color: colors.neutrals.textMuted, marginTop: spacing.md }}>
                                Reporting concern regarding: {name}
                            </Text>
                        )}
                    </Section>

                    <Spacer size="xl" />

                    <Section>
                        <Text weight="bold" style={styles.label}>Reason for report</Text>
                        <View style={styles.reasonContainer}>
                            {reasons.map((r) => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.reasonItem, reason === r && styles.reasonItemActive]}
                                    onPress={() => setReason(r)}
                                >
                                    <View style={[styles.radio, reason === r && styles.radioActive]}>
                                        {reason === r && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[styles.reasonText, reason === r && styles.reasonTextActive]}>{r}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Section>

                    <Spacer size="xl" />

                    <Section>
                        <Text weight="bold" style={styles.label}>Details</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Please provide as much detail as possible..."
                            placeholderTextColor={colors.neutrals.textMuted}
                            multiline
                            numberOfLines={6}
                            value={details}
                            onChangeText={setDetails}
                            textAlignVertical="top"
                        />
                        <Text variant="caption" color={colors.neutrals.textMuted} style={{ marginTop: spacing.xs }}>
                            Include dates, times and specific details of what happened.
                        </Text>
                    </Section>

                    <Spacer size="3xl" />

                    <Button
                        title="Submit Report"
                        onPress={handleSubmit}
                        variant="primary"
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={!reason || !details.trim()}
                    />
                </Container>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        backgroundColor: colors.neutrals.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        width: 60,
    },
    content: {
        paddingVertical: spacing.xl,
    },
    label: {
        fontSize: typography.fontSize.base,
        marginBottom: spacing.md,
        color: colors.neutrals.textPrimary,
    },
    reasonContainer: {
        gap: spacing.sm,
    },
    reasonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        gap: spacing.md,
    },
    reasonItemActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primarySoft,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.neutrals.borderAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioActive: {
        borderColor: colors.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    reasonText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
    },
    reasonTextActive: {
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    textArea: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
        minHeight: 120,
    },
});

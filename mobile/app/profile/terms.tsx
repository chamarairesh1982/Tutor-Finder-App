import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../src/lib/theme';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Terms of Service</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.lastUpdated}>Last updated: January 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.heading}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>
                        By accessing or using the Tutor Finder platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>2. Use License</Text>
                    <Text style={styles.paragraph}>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Tutor Finder's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>3. User Accounts</Text>
                    <Text style={styles.paragraph}>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>4. Booking Guidelines</Text>
                    <Text style={styles.paragraph}>
                        Tutors and students are responsible for honoring confirmed bookings. Cancellations must be made at least 24 hours in advance. Repeated cancellations may result in account suspension.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>5. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>
                        In no event shall Tutor Finder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Tutor Finder.
                    </Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
        gap: spacing.md,
    },
    backButton: {
        fontSize: typography.fontSize.base,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing['4xl'],
    },
    lastUpdated: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textMuted,
        marginBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    heading: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.sm,
    },
    paragraph: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        lineHeight: 24,
    },
});

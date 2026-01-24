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
                <Text style={styles.lastUpdated}>Last updated: 24 January 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.heading}>1. Marketplace Role</Text>
                    <Text style={styles.paragraph}>
                        TutorMatch is a platform connecting students and tutors. We act as an intermediary to facilitate these connections and are not a party to any tutoring agreement or arrangement made between users.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>2. No Employment</Text>
                    <Text style={styles.paragraph}>
                        Tutors using the platform are independent self-employed professionals. TutorMatch does not employ tutors, and no employment relationship is created between any tutor and the platform.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>3. Verification & DBS</Text>
                    <Text style={styles.paragraph}>
                        While tutors may declare their DBS status and upload certificates, TutorMatch does not verify the authenticity of these documents. It is the responsibility of parents and students to conduct their own due diligence and verify credentials before starting lessons.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>4. Payments</Text>
                    <Text style={styles.paragraph}>
                        TutorMatch does not currently process payments. All financial arrangements, including rates and payment methods, must be arranged directly between the tutor and the student/parent.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>5. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>
                        TutorMatch is not liable for the quality of tutoring, the conduct of tutors or students, or any disputes arising from arrangements made through the platform. Use of the service is at your own risk.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>6. Safeguarding</Text>
                    <Text style={styles.paragraph}>
                        We take safeguarding seriously. Users are encouraged to report any concerns immediately through our "Report a Concern" feature available on tutor profiles and booking pages.
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

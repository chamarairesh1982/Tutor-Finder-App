import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../src/lib/theme';

export default function PrivacyPolicyScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Privacy Policy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.lastUpdated}>Last updated: 24 January 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.heading}>1. UK GDPR Compliance</Text>
                    <Text style={styles.paragraph}>
                        TutorMatch is committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>2. Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        We collect personal information that you provide to us, including:
                        • Contact details (name, email, phone number)
                        • Professional details for tutors (bio, qualifications, subjects)
                        • Location data (postcode only) for search proximity
                        • Identification documents (optional DBS certificates)
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>3. How We Use Your Data</Text>
                    <Text style={styles.paragraph}>
                        We use your data to:
                        • Provide and manage your account
                        • Facilitate connections between tutors and students
                        • Communicate important service updates
                        • Ensure the safety and security of our users
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>4. Data Sharing</Text>
                    <Text style={styles.paragraph}>
                        We share your profile information (for tutors) with potential students through our search functionality. We do not sell your personal data to third parties.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>5. Your Rights</Text>
                    <Text style={styles.paragraph}>
                        Under UK GDPR, you have the right to access, rectify, or erase your personal data. You also have the right to object to or restrict certain processing activities.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>6. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about our privacy practices or wish to exercise your data rights, please contact us at: privacy@tutormatch.uk
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

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';

const FAQS = [
    {
        question: "How do I book a tutor?",
        answer: "Browse for a tutor by subject, view their profile, and tap 'Book Session'. You can then message the tutor to propose dates and discuss your requirements."
    },
    {
        question: "How do I pay my tutor?",
        answer: "In the current version, TutorMatch does not process payments. You should arrange payment directly with your tutor (e.g., via bank transfer) as agreed between you."
    },
    {
        question: "What if I need a refund?",
        answer: "Since payments are handled directly between you and the tutor, any refunds must be negotiated with the tutor. We recommend agreeing on a cancellation policy before starting."
    },
    {
        question: "Are tutors background checked?",
        answer: "Tutors can declare their DBS status on their profile. However, TutorMatch does not currently verify these documents. We strongly recommend students and parents perform their own due diligence."
    }
];

export default function HelpCenterScreen() {
    const router = useRouter();

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@tutormatch.uk');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Help Center</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
                    {FAQS.map((faq, index) => (
                        <View key={index} style={styles.faqItem}>
                            <Text style={styles.question}>{faq.question}</Text>
                            <Text style={styles.answer}>{faq.answer}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.contactCard}>
                    <Text style={styles.contactTitle}>Still need help?</Text>
                    <Text style={styles.contactText}>Our support team is available Mon-Fri, 9am-5pm.</Text>
                    <TouchableOpacity style={styles.contactButton} onPress={handleEmailSupport}>
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.safeguardingSection}>
                    <Ionicons name="shield-outline" size={24} color={colors.neutrals.textMuted} />
                    <Text style={styles.safeguardingText}>
                        TutorMatch is a marketplace connecting students with tutors. We do not employ tutors or verify credentials. Parents and students should conduct their own due diligence.
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
        gap: spacing.xl,
    },
    section: {
        gap: spacing.md,
    },
    sectionHeader: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xs,
    },
    faqItem: {
        backgroundColor: colors.neutrals.background,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    question: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xs,
    },
    answer: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: colors.primarySoft,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        gap: spacing.md,
    },
    contactTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
    },
    contactText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        width: '100%',
        alignItems: 'center',
    },
    contactButtonText: {
        color: colors.neutrals.surface,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
    safeguardingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.md,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.lg,
        marginTop: spacing.xl,
    },
    safeguardingText: {
        flex: 1,
        fontSize: 10,
        color: colors.neutrals.textMuted,
        lineHeight: 16,
    }
});

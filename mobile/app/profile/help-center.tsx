import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';

const FAQS = [
    {
        question: "How do I book a tutor?",
        answer: "Search for a tutor by subject or location, view their profile, and click 'Request Booking' options. You can propose a time and mode of teaching."
    },
    {
        question: "Is there a booking fee?",
        answer: "Tutor Finder charges a small service fee on completed bookings to maintain the platform safety and security."
    },
    {
        question: "how do refunds work?",
        answer: "If a tutor cancels or does not show up, you are entitled to a full refund. Please contact support within 24 hours of the scheduled session."
    },
    {
        question: "Can I change my password?",
        answer: "Yes, go to Profile > Account Settings > Change Password to update your login credentials."
    }
];

export default function HelpCenterScreen() {
    const router = useRouter();

    const handleEmailSupport = () => {
        Linking.openURL('mailto:support@tutorfinder.uk');
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
        borderColor: colors.neutrals.cardBorder,
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
});

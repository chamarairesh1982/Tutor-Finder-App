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
                <Text style={styles.lastUpdated}>Last updated: January 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.heading}>1. Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>2. How We Use Your Information</Text>
                    <Text style={styles.paragraph}>
                        We use the information we collect to facilitate the connection between tutors and students. This includes sharing your profile information (like name and subjects) with potential matches. We also use your data to maintain the safety and security of our platform.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>3. Data Security</Text>
                    <Text style={styles.paragraph}>
                        We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All payment transactions are encrypted using SSL technology.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>4. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        If you have any questions about this Privacy Policy, please contact us at: privacy@tutorfinder.uk
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

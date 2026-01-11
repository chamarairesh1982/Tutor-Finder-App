import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components';
import { useRegister } from '../../src/hooks/useAuth';
import { useNotificationStore } from '../../src/store/notificationStore';
import { getFriendlyApiError } from '../../src/lib/networkError';
import { colors, spacing, typography, borderRadius } from '../../src/lib/theme';

import { UserRole } from '../../src/types';

export default function RegisterScreen() {
    const router = useRouter();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Student);
    const { mutate: register, isPending } = useRegister();
    const notify = useNotificationStore((s) => s.addToast);


    const handleRegister = () => {
        if (!displayName || !email || !password) {
            notify({ type: 'error', title: 'Missing details', message: 'Please fill in all fields.' });
            return;
        }

        if (password.length < 6) {
            notify({ type: 'error', title: 'Weak password', message: 'Password must be at least 6 characters.' });
            return;
        }


        register(
            { displayName, email, password, role },
            {
                onSuccess: () => {
                    notify({ type: 'success', title: 'Account created', message: 'Welcome to TutorFinder.' });
                    router.replace('/(tabs)');
                },
                onError: (error: any) => {
                    const friendly = getFriendlyApiError(error);
                    notify({ type: 'error', title: friendly.title, message: friendly.message });
                },

            }
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our community of students and tutors</Text>
                </View>

                <View style={styles.roleSelection}>
                    <Text style={styles.roleLabel}>I want to join as a:</Text>
                    <View style={styles.roleButtons}>
                        <TouchableOpacity
                            style={[styles.roleBtn, role === UserRole.Student && styles.roleBtnActive]}
                            onPress={() => setRole(UserRole.Student)}
                        >
                            <Text style={[styles.roleBtnText, role === UserRole.Student && styles.roleBtnTextActive]}>
                                Student
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleBtn, role === UserRole.Tutor && styles.roleBtnActive]}
                            onPress={() => setRole(UserRole.Tutor)}
                        >
                            <Text style={[styles.roleBtnText, role === UserRole.Tutor && styles.roleBtnTextActive]}>
                                Tutor
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={displayName}
                        onChangeText={setDisplayName}
                    />

                    <Input
                        label="Email Address"
                        placeholder="example@email.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Input
                        label="Password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Text style={styles.consentText}>
                        By registering, you agree to our Terms of Service and Privacy Policy.
                    </Text>

                    <Button
                        title="Create Account"
                        onPress={handleRegister}
                        isLoading={isPending}
                        fullWidth
                        style={styles.registerBtn}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    scrollContent: {
        padding: spacing.xl,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
    },
    roleSelection: {
        marginBottom: spacing.xl,
    },
    roleLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.sm,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        alignItems: 'center',
        backgroundColor: colors.neutrals.surface,
    },
    roleBtnActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10', // 10% opacity
    },
    roleBtnText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textSecondary,
    },
    roleBtnTextActive: {
        color: colors.primary,
    },
    form: {
        flex: 1,
    },
    consentText: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 18,
    },
    registerBtn: {
        marginBottom: spacing.xl,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    linkText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
});

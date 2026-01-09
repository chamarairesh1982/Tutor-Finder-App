import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components';
import { useLogin } from '../../src/hooks/useAuth';
import { colors, spacing, typography } from '../../src/lib/theme';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: login, isPending } = useLogin();

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        login(
            { email, password },
            {
                onSuccess: () => {
                    router.replace('/(tabs)');
                },
                onError: (error: any) => {
                    const message = error.response?.data?.detail || 'Invalid email or password';
                    Alert.alert('Login Failed', message);
                },
            }
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sign In</Text>
                    <Text style={styles.subtitle}>Enter your details to access your account</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email Address"
                        placeholder="example@email.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <View style={styles.passwordRow}>
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.passwordInput}
                        />
                    </View>

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        isLoading={isPending}
                        fullWidth
                        style={styles.loginBtn}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Register Now</Text>
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
        marginBottom: spacing.xl * 1.5,
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
    form: {
        flex: 1,
    },
    passwordRow: {
        marginBottom: spacing.xs,
    },
    passwordInput: {
        flex: 1,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: spacing.xl,
    },
    forgotText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary,
        fontWeight: typography.fontWeight.medium,
    },
    loginBtn: {
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

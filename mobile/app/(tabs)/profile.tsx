import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { useLogout } from '../../src/hooks/useAuth';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { UserRole } from '../../src/types';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { mutate: logout } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                router.replace('/(auth)/login');
            },
        });
    };

    const renderAuthRequired = () => (
        <View style={styles.centered}>
            <Text style={styles.emptyText}>Sign in to view your profile and manage bookings.</Text>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/(auth)/login')}
            >
                <Text style={styles.actionButtonText}>Sign In / Register</Text>
            </TouchableOpacity>
        </View>
    );

    if (!isAuthenticated || !user) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>
                {renderAuthRequired()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarInitialLarge}>{user.displayName.charAt(0)}</Text>
                    </View>
                    <Text style={styles.userName}>{user.displayName}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>
                            {user.role === UserRole.Tutor ? 'TUTOR' : user.role === UserRole.Admin ? 'ADMIN' : 'STUDENT'}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Edit Personal Info</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>

                    {user.role === UserRole.Tutor && (
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/profile/tutor-setup')}
                        >
                            <Text style={styles.menuItemText}>Tutor Profile Settings</Text>
                            <Text style={styles.menuItemArrow}>›</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Change Password</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Notifications</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Help Center</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Privacy Policy</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Terms of Service</Text>
                        <Text style={styles.menuItemArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    header: {
        padding: spacing.md,
        backgroundColor: colors.neutrals.background,
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    profileCard: {
        backgroundColor: colors.neutrals.background,
        alignItems: 'center',
        padding: spacing.xl,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    avatarInitialLarge: {
        fontSize: 32,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.background,
    },
    userName: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    userEmail: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        marginBottom: spacing.sm,
    },
    roleBadge: {
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    roleText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textSecondary,
        letterSpacing: 1,
    },
    section: {
        backgroundColor: colors.neutrals.background,
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        ...shadows.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        marginLeft: spacing.md,
        marginVertical: spacing.sm,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.surface,
    },
    menuItemText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
    },
    menuItemArrow: {
        fontSize: typography.fontSize.xl,
        color: colors.neutrals.textMuted,
    },
    logoutButton: {
        margin: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.neutrals.background,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.error,
    },
    logoutButtonText: {
        color: colors.error,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
    versionText: {
        textAlign: 'center',
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        marginTop: spacing.sm,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    actionButtonText: {
        color: colors.neutrals.background,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
});

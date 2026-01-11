import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
            <View style={styles.authIconContainer}>
                <Ionicons name="person-circle-outline" size={80} color={colors.neutrals.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Create a Profile</Text>
            <Text style={styles.emptyText}>Sign in to view your profile and manage bookings.</Text>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/(auth)/login')}
                activeOpacity={0.8}
            >
                <Text style={styles.actionButtonText}>Sign In / Register</Text>
            </TouchableOpacity>
        </View>
    );

    const MenuItem = ({ icon, label, onPress, isLast = false, color }: { icon: string, label: string, onPress: () => void, isLast?: boolean, color?: string }) => (
        <TouchableOpacity
            style={[styles.menuItem, isLast && styles.menuItemLast]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color ? `${color}15` : colors.neutrals.surfaceAlt }]}>
                    <Ionicons name={icon as any} size={20} color={color || colors.primary} />
                </View>
                <Text style={[styles.menuItemText, color && { color }]}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.neutrals.textMuted} />
        </TouchableOpacity>
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
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarInitialLarge}>{(user.displayName || user.email || '?').charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.userName}>{user.displayName || 'Account'}</Text>
                    <Text style={styles.userEmail}>{user.email || ''}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>
                            {user.role === UserRole.Tutor ? 'TUTOR' : user.role === UserRole.Admin ? 'ADMIN' : 'STUDENT'}
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon="person-outline"
                            label="Edit Personal Info"
                            onPress={() => router.push('/profile/edit-info')}
                        />
                        <MenuItem
                            icon="lock-closed-outline"
                            label="Change Password"
                            onPress={() => router.push('/profile/change-password')}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            label="Notifications"
                            onPress={() => router.push('/profile/notifications')}
                            isLast={user.role !== UserRole.Tutor}
                        />
                        {user.role === UserRole.Tutor && (
                            <MenuItem
                                icon="school-outline"
                                label="Tutor Profile Settings"
                                onPress={() => router.push('/profile/edit-info')}
                                isLast
                            />
                        )}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon="help-circle-outline"
                            label="Help Center"
                            onPress={() => router.push('/profile/help-center')}
                        />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            label="Privacy Policy"
                            onPress={() => router.push('/profile/privacy')}
                        />
                        <MenuItem
                            icon="document-text-outline"
                            label="Terms of Service"
                            onPress={() => router.push('/profile/terms')}
                            isLast
                        />
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon="log-out-outline"
                            label="Log Out"
                            onPress={handleLogout}
                            color={colors.error}
                            isLast
                        />
                    </View>
                </View>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.surfaceAlt, // Slightly darker background for contrast
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing['4xl'],
    },
    profileCard: {
        backgroundColor: colors.neutrals.background,
        alignItems: 'center',
        padding: spacing.xl,
        borderRadius: borderRadius.xl, // More rounded corners
        marginBottom: spacing.lg,
        // Softer shadow
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 2,
    },
    avatarLarge: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    avatarInitialLarge: {
        fontSize: 36,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.background,
    },
    userName: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        marginBottom: spacing.md,
    },
    roleBadge: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    roleText: {
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
        letterSpacing: 1,
    },
    sectionContainer: {
        marginBottom: spacing.lg,
    },
    sectionCard: {
        backgroundColor: colors.neutrals.background,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        // Softer shadow
        shadowColor: 'rgba(0,0,0,0.03)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        marginLeft: spacing.sm,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.surfaceAlt,
        backgroundColor: colors.neutrals.background,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textPrimary,
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
    authIconContainer: {
        marginBottom: spacing.lg,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.xs,
    },
    emptyText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        maxWidth: 300,
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        color: colors.neutrals.background,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
});

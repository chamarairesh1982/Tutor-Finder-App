import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useLogout } from '../../src/hooks/useAuth';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { UserRole } from '../../src/types';
import { useMyTutorProfile } from '../../src/hooks/useTutors';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { data: profile } = useMyTutorProfile();
    const { mutate: logout } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                router.replace('/(auth)/login');
            },
        });
    };

    if (!isAuthenticated || !user) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>
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
            </SafeAreaView>
        );
    }

    const MenuItem = ({ icon, label, onPress, isLast = false, color }: { icon: string, label: string, onPress: () => void, isLast?: boolean, color?: string }) => (
        <TouchableOpacity
            style={[styles.menuItem, isLast && styles.menuItemLast]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color ? `${color}15` : colors.neutrals.surfaceAlt }]}>
                    <Ionicons name={icon as any} size={20} color={color || colors.primaryDark} />
                </View>
                <Text style={[styles.menuItemText, color && { color }]}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.neutrals.textMuted} />
        </TouchableOpacity>
    );

    const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <View style={styles.headerGradient}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitleInv}>Profile</Text>
                        <TouchableOpacity style={styles.settingsBtn}>
                            <Ionicons name="settings-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileCard}>
                    <View style={styles.profileMain}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarLarge}>
                                <Text style={styles.avatarInitialLarge}>{initial}</Text>
                            </View>
                            <TouchableOpacity style={styles.editAvatarBtn}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileTextInfo}>
                            <Text style={styles.userName}>{user.displayName || 'Account'}</Text>
                            <Text style={styles.userEmail}>{user.email || ''}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleText}>
                                        {user.role === UserRole.Tutor ? 'Professional Tutor' : 'Learner'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Lessons</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>8</Text>
                            <Text style={styles.statLabel}>Favorites</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.9★</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </View>

                {user.role === UserRole.Tutor && (!profile?.bio || profile.subjects.length === 0) && (
                    <TouchableOpacity
                        style={styles.onboardingCard}
                        onPress={() => router.push('/profile/onboarding')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.onboardingInfo}>
                            <View style={styles.onboardingIcon}>
                                <Ionicons name="sparkles" size={24} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.onboardingTitle}>Complete Your Profile</Text>
                                <Text style={styles.onboardingSubtitle}>Tutors with complete profiles get 300% more bookings.</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
                        </View>
                    </TouchableOpacity>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <View style={styles.sectionCard}>
                        {user.role === UserRole.Tutor && (
                            <MenuItem
                                icon="stats-chart-outline"
                                label="My Tutor Dashboard"
                                color={colors.primary}
                                onPress={() => router.push('/profile/dashboard')}
                            />
                        )}
                        <MenuItem
                            icon="calendar-outline"
                            label="Schedule & Bookings"
                            onPress={() => router.push('/(tabs)/bookings')}
                        />
                        <MenuItem
                            icon="heart-outline"
                            label="My Favorite Tutors"
                            onPress={() => router.push('/(tabs)/favorites')}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            label="Notifications"
                            onPress={() => router.push('/profile/notifications')}
                            isLast
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon="person-outline"
                            label="Edit Profile"
                            onPress={() => router.push('/profile/edit-info')}
                        />
                        <MenuItem
                            icon="medical-outline"
                            label="Change Password"
                            onPress={() => router.push('/profile/change-password')}
                        />
                        <MenuItem
                            icon="lock-closed-outline"
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem
                            icon="help-circle-outline"
                            label="Help Center"
                            onPress={() => router.push('/profile/help-center')}
                        />
                        <MenuItem
                            icon="chatbubble-outline"
                            label="Report a Concern"
                            onPress={() => router.push('/profile/report' as any)}
                            isLast
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>TutorFinder v1.0.0 (Alpha)</Text>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    headerGradient: {
        height: 180,
        backgroundColor: colors.primaryDark,
        paddingHorizontal: spacing.xl,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    },
    headerTitleInv: {
        fontSize: 24,
        fontWeight: typography.fontWeight.heavy,
        color: '#fff',
    },
    settingsBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        marginTop: -60,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },
    profileCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 24,
        padding: spacing.xl,
        ...shadows.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        marginBottom: spacing.xl,
    },
    profileMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.xl,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        ...shadows.sm,
    },
    avatarInitialLarge: {
        fontSize: 32,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileTextInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: colors.neutrals.textMuted,
        marginBottom: spacing.sm,
    },
    roleBadge: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primaryDark,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
        marginTop: 2,
        fontWeight: typography.fontWeight.medium,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: colors.neutrals.border,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textMuted,
        marginBottom: spacing.md,
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutrals.border,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.neutrals.surface,
        padding: spacing.lg,
        borderRadius: 20,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.error + '20',
        ...shadows.sm,
        marginTop: spacing.sm,
    },
    logoutText: {
        color: colors.error,
        fontWeight: typography.fontWeight.bold,
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        marginTop: spacing.xl,
        fontSize: 12,
        color: colors.neutrals.textMuted,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    authIconContainer: {
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        marginBottom: spacing['2xl'],
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.full,
        ...shadows.md,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: typography.fontWeight.bold,
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        backgroundColor: colors.neutrals.background,
    },
    title: {
        fontSize: 28,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    onboardingCard: {
        backgroundColor: colors.primary,
        borderRadius: 24,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        ...shadows.md,
    },
    onboardingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    onboardingIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    onboardingTitle: {
        fontSize: 18,
        fontWeight: typography.fontWeight.bold,
        color: '#fff',
        marginBottom: 2,
    },
    onboardingSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 18,
    },
});

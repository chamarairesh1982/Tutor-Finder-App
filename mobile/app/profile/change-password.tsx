import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components';
import { useChangePassword } from '../../src/hooks/useUser';
import { colors, spacing, typography } from '../../src/lib/theme';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { mutate: changePassword, isPending } = useChangePassword();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        changePassword(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    Alert.alert('Success', 'Password changed successfully', [
                        { text: 'OK', onPress: () => router.back() }
                    ]);
                },
                onError: (error: any) => {
                    Alert.alert('Error', error.response?.data?.detail || 'Failed to change password');
                }
            }
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Change Password</Text>
            </View>

            <View style={styles.form}>
                <Input
                    label="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    placeholder="Enter current password"
                />
                <Input
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder="Enter new password"
                />
                <Input
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Confirm new password"
                />

                <Button
                    title="Change Password"
                    onPress={handleSave}
                    isLoading={isPending}
                    style={styles.saveButton}
                />
            </View>
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
    form: {
        padding: spacing.lg,
        gap: spacing.lg,
    },
    saveButton: {
        marginTop: spacing.xl,
    },
});

import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components';
import { useAuthStore } from '../../src/store/authStore';
import { useUpdateProfile } from '../../src/hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../../src/lib/theme';

export default function EditInfoScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = () => {
        if (!displayName.trim() || !email.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        updateProfile(
            { displayName, email },
            {
                onSuccess: () => {
                    Alert.alert('Success', 'Profile updated successfully', [
                        { text: 'OK', onPress: () => router.back() }
                    ]);
                },
                onError: (error: any) => {
                    Alert.alert('Error', error.response?.data?.detail || 'Failed to update profile');
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
                <Text style={styles.title}>Edit Profile</Text>
            </View>

            <View style={styles.form}>
                <Input
                    label="Full Name"
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                />
                <Input
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Button
                    title="Save Changes"
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

import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing, shadows, borderRadius } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';

interface PaymentModalProps {
    visible: boolean;
    amount: number;
    bookingId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function PaymentModal({ visible, amount, onClose, onSuccess }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    const handlePay = () => {
        setLoading(true);
        // On web, we simulate the payment for now to avoid the native codegen error
        setTimeout(() => {
            setStep('success');
            setLoading(false);
            setTimeout(() => {
                onSuccess();
                setStep('details');
            }, 1500);
        }, 2000);
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {step === 'details' && (
                        <>
                            <View style={styles.header}>
                                <Text variant="h4">Secure Web Payment</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.neutrals.textMuted} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.summary}>
                                <Text style={styles.label}>Total to pay</Text>
                                <Text variant="h2" color={colors.primary}>£{amount.toFixed(2)}</Text>
                            </View>

                            <View style={styles.webAlert}>
                                <Ionicons name="information-circle" size={20} color={colors.primary} />
                                <Text style={styles.webAlertText}>
                                    Native Stripe SDK is disabled on web. This is a simulated checkout.
                                </Text>
                            </View>

                            <Button
                                title={`Complete Simulated Payment (£${amount.toFixed(2)})`}
                                onPress={handlePay}
                                size="lg"
                                style={{ marginTop: spacing.md }}
                                isLoading={loading}
                            />

                            <View style={styles.secureRow}>
                                <Ionicons name="lock-closed" size={12} color={colors.neutrals.textMuted} />
                                <Text variant="caption" style={{ marginLeft: 4 }}>Payments simulation mode</Text>
                            </View>
                        </>
                    )}

                    {step === 'success' && (
                        <View style={styles.centered}>
                            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                            <Text variant="h4" style={{ marginTop: spacing.md }}>Payment Successful!</Text>
                            <Text variant="body" color={colors.neutrals.textSecondary}>Simulation complete.</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 24,
        padding: spacing.xl,
        width: 400,
        maxWidth: '90%',
        minHeight: 350,
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    summary: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    label: {
        fontSize: 14,
        color: colors.neutrals.textSecondary,
        marginBottom: 8,
    },
    webAlert: {
        flexDirection: 'row',
        backgroundColor: colors.primarySoft,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    webAlertText: {
        fontSize: 13,
        color: colors.primary,
        flex: 1,
        lineHeight: 18,
    },
    secureRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    }
});

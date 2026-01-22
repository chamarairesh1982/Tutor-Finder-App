import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing, borderRadius, shadows } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';

interface PaymentModalProps {
    visible: boolean;
    amount: number;
    onClose: () => void;
    onSuccess: () => void;
}

export function PaymentModal({ visible, amount, onClose, onSuccess }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    const handlePay = () => {
        setStep('processing');
        setLoading(true);

        // Simulate network request to backend (CreatePaymentIntent)
        // and then confirming with Stripe
        setTimeout(() => {
            setLoading(false);
            setStep('success');
            setTimeout(() => {
                onSuccess();
                setStep('details'); // Reset for next time
            }, 1500);
        }, 2000);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {step === 'details' && (
                        <>
                            <View style={styles.header}>
                                <Text variant="h4">Checkout</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.neutrals.textMuted} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.summary}>
                                <Text style={styles.label}>Total to pay</Text>
                                <Text variant="h2" color={colors.primary}>£{amount.toFixed(2)}</Text>
                            </View>

                            {/* Mock Card Input */}
                            <View style={styles.cardInput}>
                                <Ionicons name="card-outline" size={24} color={colors.neutrals.textMuted} />
                                <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
                            </View>

                            <Button
                                title={`Pay £${amount.toFixed(2)}`}
                                onPress={handlePay}
                                size="lg"
                                style={{ marginTop: spacing.lg }}
                            />

                            <View style={styles.secureRow}>
                                <Ionicons name="lock-closed" size={12} color={colors.neutrals.textMuted} />
                                <Text variant="caption" style={{ marginLeft: 4 }}>Payments secured by Stripe</Text>
                            </View>
                        </>
                    )}

                    {step === 'processing' && (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ marginTop: spacing.md }}>Processing payment...</Text>
                        </View>
                    )}

                    {step === 'success' && (
                        <View style={styles.centered}>
                            <Ionicons name="checkmark-circle" size={64} color={colors.statusAccepted} />
                            <Text variant="h4" style={{ marginTop: spacing.md }}>Payment Successful!</Text>
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
        justifyContent: 'flex-end',
    },
    card: {
        backgroundColor: colors.neutrals.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.xl,
        minHeight: 400,
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
    cardInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.background,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        marginBottom: spacing.md,
    },
    cardNumber: {
        marginLeft: spacing.md,
        fontSize: 16,
        fontFamily: 'monospace',
        color: colors.neutrals.textPrimary,
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

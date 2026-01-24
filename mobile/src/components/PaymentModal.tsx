import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing, borderRadius, shadows } from '../lib/theme';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';

interface PaymentModalProps {
    visible: boolean;
    amount: number;
    bookingId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function PaymentModal({ visible, amount, bookingId, onClose, onSuccess }: PaymentModalProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await apiClient.post('/payments/create-intent', {
                bookingId,
                amount,
                currency: 'gbp'
            });

            return {
                paymentIntent: response.data.clientSecret,
                publishableKey: response.data.publishableKey,
            };
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            throw error;
        }
    };

    const initializePaymentSheet = async () => {
        setInitializing(true);
        try {
            const { paymentIntent } = await fetchPaymentSheetParams();

            const { error } = await initPaymentSheet({
                merchantDisplayName: 'TutorMatch UK',
                paymentIntentClientSecret: paymentIntent,
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: user?.displayName,
                },
                appearance: {
                    colors: {
                        primary: colors.primary,
                    },
                    shapes: {
                        borderRadius: 12,
                    }
                }
            });

            if (error) {
                Alert.alert(`Error: ${error.code}`, error.message);
            }
        } catch (error) {
            Alert.alert('Initialization failed', 'Unable to connect to payment provider.');
        } finally {
            setInitializing(false);
        }
    };

    useEffect(() => {
        if (visible && bookingId) {
            initializePaymentSheet();
        }
    }, [visible, bookingId]);

    const handlePay = async () => {
        setLoading(true);
        const { error } = await presentPaymentSheet();

        if (error) {
            if (error.code !== 'Canceled') {
                Alert.alert(`Error: ${error.code}`, error.message);
            }
            setLoading(false);
        } else {
            setStep('success');
            setTimeout(() => {
                onSuccess();
                setStep('details');
                setLoading(false);
            }, 1500);
        }
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

                            <Button
                                title={initializing ? "Loading secure checkout..." : `Pay £${amount.toFixed(2)}`}
                                onPress={handlePay}
                                size="lg"
                                style={{ marginTop: spacing.lg }}
                                disabled={initializing || loading}
                                isLoading={loading}
                            />

                            <View style={styles.secureRow}>
                                <Ionicons name="lock-closed" size={12} color={colors.neutrals.textMuted} />
                                <Text variant="caption" style={{ marginLeft: 4 }}>Payments secured by Stripe</Text>
                            </View>
                        </>
                    )}

                    {step === 'success' && (
                        <View style={styles.centered}>
                            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
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


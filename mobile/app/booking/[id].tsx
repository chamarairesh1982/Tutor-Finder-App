import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooking, useSendMessage, useRespondToBooking } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { Button } from '../../src/components';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { BookingStatus, UserRole, BookingMessage } from '../../src/types';

export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: booking, isLoading, isError, refetch } = useBooking(id!);
    const { mutate: sendMessage, isPending: isSending } = useSendMessage(id!);
    const { mutate: respond, isPending: isResponding } = useRespondToBooking(id!);

    const [message, setMessage] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const messages = booking?.messages ?? [];

    useEffect(() => {
        // Scroll to bottom when booking data updates (new messages)
        if (messages.length) {
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);


    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed) return;
        sendMessage(trimmed, {
            onSuccess: () => setMessage(''),
            onError: (err: any) => {
                const detail = err?.response?.data?.detail || 'Unable to send message.';
                Alert.alert('Send failed', detail);
            },
        });
    };


    const handleStatusChange = (newStatus: BookingStatus) => {
        respond({ newStatus }, {
            onSuccess: () => Alert.alert('Status Updated', `Booking has been ${BookingStatus[newStatus].toLowerCase()}.`),
        });
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.Pending: return { bg: colors.statusPending, text: colors.statusPendingText };
            case BookingStatus.Accepted: return { bg: colors.statusAccepted, text: colors.statusAcceptedText };
            case BookingStatus.Declined: return { bg: colors.statusDeclined, text: colors.statusDeclinedText };
            default: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary };
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isError || !booking) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Booking not found.</Text>
            </View>
        );
    }

    const isTutor = user?.role === UserRole.Tutor;
    const statusStyles = getStatusColor(booking.status);
    const modeLabel = booking.preferredMode === 0 ? 'In Person' : booking.preferredMode === 1 ? 'Online' : 'Flexible';
    const priceLabel = booking.pricePerHour ? `£${booking.pricePerHour}/hr` : '£—/hr';
    const dateLabel = booking.preferredDate || 'Flexible';


    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.infoCard}>
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.headerLabel}>{isTutor ? 'Student' : 'Tutor'}</Text>
                                <Text style={styles.headerValue}>{isTutor ? booking.studentName : booking.tutorName}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
                                <Text style={[styles.statusText, { color: statusStyles.text }]}>
                                    {BookingStatus[booking.status]}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Date</Text>
                                <Text style={styles.detailValue}>{dateLabel}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Mode</Text>
                                <Text style={styles.detailValue}>
                                    {modeLabel}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Price</Text>
                                <Text style={styles.detailValue}>{priceLabel}</Text>
                            </View>

                        </View>

                        {isTutor && booking.status === BookingStatus.Pending && (
                            <View style={styles.actionButtons}>
                                <Button
                                    title="Accept"
                                    onPress={() => handleStatusChange(BookingStatus.Accepted)}
                                    variant="secondary"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    isLoading={isResponding}
                                />
                                <Button
                                    title="Decline"
                                    onPress={() => handleStatusChange(BookingStatus.Declined)}
                                    variant="outline"
                                    size="sm"
                                    style={{ flex: 1, borderColor: colors.error }}
                                    textStyle={{ color: colors.error }}
                                    isLoading={isResponding}
                                />
                            </View>
                        )}
                    </View>

                    <Text style={styles.messageTitle}>Messages</Text>

                    <View style={styles.messagesList}>
                        {(messages.length ? messages : []).map((msg: BookingMessage) => {
                            const isMe = msg.senderId === user?.id;
                            return (
                                <View
                                    key={msg.id}
                                    style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageOther]}
                                >
                                    {!isMe && <Text style={styles.senderName}>{msg.senderName}</Text>}
                                    <Text style={[styles.messageText, isMe && styles.messageTextMe]}>{msg.content}</Text>
                                    <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>
                                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            );
                        })}
                        {!messages.length && (
                            <Text style={styles.emptyMessage}>No messages yet. Start the conversation.</Text>
                        )}
                    </View>

                </ScrollView>

                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!message.trim() || isSending) && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!message.trim() || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color={colors.neutrals.background} size="small" />
                        ) : (
                            <Text style={styles.sendBtnText}>Send</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: spacing.md,
    },
    infoCard: {
        backgroundColor: colors.neutrals.background,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
        marginBottom: spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    headerLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        textTransform: 'uppercase',
    },
    headerValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.surfaceAlt,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
    },
    detailValue: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    messageTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textSecondary,
        marginBottom: spacing.md,
        textTransform: 'uppercase',
    },
    messagesList: {
        marginBottom: spacing.md,
    },
    emptyMessage: {
        color: colors.neutrals.textSecondary,
        fontSize: typography.fontSize.sm,
        marginBottom: spacing.md,
    },

    messageBubble: {
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        maxWidth: '85%',
    },
    messageMe: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primary,
        borderBottomRightRadius: 2,
    },
    messageOther: {
        alignSelf: 'flex-start',
        backgroundColor: colors.neutrals.background,
        borderBottomLeftRadius: 2,
        ...shadows.sm,
    },
    senderName: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: 4,
    },
    messageText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textPrimary,
    },
    messageTextMe: {
        color: colors.neutrals.background,
    },
    messageTime: {
        fontSize: 10,
        color: colors.neutrals.textMuted,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    messageTimeMe: {
        color: colors.primaryLight,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.md,
        backgroundColor: colors.neutrals.background,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
    },
    input: {
        flex: 1,
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        paddingTop: spacing.sm,
        maxHeight: 100,
        fontSize: typography.fontSize.base,
        marginRight: spacing.sm,
    },
    sendBtn: {
        backgroundColor: colors.primary,
        width: 60,
        height: 48,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        opacity: 0.5,
    },
    sendBtnText: {
        color: colors.neutrals.background,
        fontWeight: typography.fontWeight.bold,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
    },
});

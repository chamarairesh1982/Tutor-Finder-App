import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooking, useSendMessage, useRespondToBooking, useCancelBooking, useCompleteBooking, useMarkAsRead } from '../../src/hooks/useBookings';
import { useCreateReview } from '../../src/hooks/useReviews';
import { useAuthStore } from '../../src/store/authStore';
import { useNotificationStore } from '../../src/store/notificationStore';
import { Button, ReviewComposer, PaymentModal, TypingIndicator } from '../../src/components';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { BookingStatus, UserRole, BookingMessage } from '../../src/types';



export default function BookingDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: booking, isLoading, isError, refetch } = useBooking(id!);
    const { mutate: sendMessage, isPending: isSending } = useSendMessage(id!);
    const { mutate: respond, isPending: isResponding } = useRespondToBooking(id!);
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking(id!);
    const { mutate: completeBooking, isPending: isCompleting } = useCompleteBooking(id!);
    const { mutate: markAsRead } = useMarkAsRead(id!);
    const { mutate: createReview, isPending: isReviewing } = useCreateReview();
    const notify = useNotificationStore((s) => s.addToast);
    const connection = useNotificationStore((s) => s.connection);

    const [message, setMessage] = useState('');
    const [isCounterpartTyping, setIsCounterpartTyping] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);
    const typingTimeoutRef = useRef<any>(null);
    const lastTypingSentRef = useRef<number>(0);

    const messages = booking?.messages ?? [];
    const isTutor = user?.role === UserRole.Tutor;
    const recipientUserId = isTutor ? booking?.studentId : booking?.tutorUserId;

    useEffect(() => {
        // Scroll to bottom when booking data updates (new messages) or typing starts
        if (messages.length || isCounterpartTyping) {
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length, isCounterpartTyping]);

    // SignalR Listeners
    useEffect(() => {
        if (!connection || !id) return;

        const handleTyping = (bid: string, isTyping: boolean) => {
            if (bid === id) setIsCounterpartTyping(isTyping);
        };

        const handleRead = (bid: string) => {
            if (bid === id) refetch();
        };

        connection.on("TypingStatus", handleTyping);
        connection.on("MessagesRead", handleRead);

        return () => {
            connection.off("TypingStatus", handleTyping);
            connection.off("MessagesRead", handleRead);
        };
    }, [connection, id, refetch]);

    // Mark as read logic
    useEffect(() => {
        const unreadCount = messages.filter(m => m.senderId !== user?.id && !m.isRead).length;
        if (unreadCount > 0 && recipientUserId) {
            markAsRead(undefined, {
                onSuccess: () => {
                    connection?.invoke("NotifyMessagesRead", id, recipientUserId);
                }
            });
        }
    }, [messages.length, recipientUserId]);

    const handleTypingInput = (text: string) => {
        setMessage(text);
        if (!connection || !recipientUserId) return;

        const now = Date.now();
        if (now - lastTypingSentRef.current > 3000) {
            connection.invoke("SendTypingStatus", id, recipientUserId, true);
            lastTypingSentRef.current = now;

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                connection.invoke("SendTypingStatus", id, recipientUserId, false);
            }, 4000);
        }
    };

    const handleSend = () => {
        const trimmed = message.trim();
        if (!trimmed) return;

        // Stop typing indicator immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (connection && recipientUserId) {
            connection.invoke("SendTypingStatus", id, recipientUserId, false);
        }

        sendMessage(trimmed, {
            onSuccess: () => setMessage(''),
            onError: (err: any) => {
                const detail = err?.response?.data?.detail || 'Unable to send message.';
                notify({ type: 'error', title: 'Send failed', message: detail });
            },
        });
    };


    const handleStatusChange = (newStatus: BookingStatus) => {
        respond({ newStatus }, {
            onSuccess: () => {
                notify({ type: 'success', title: 'Status updated', message: `Booking is now ${BookingStatus[newStatus]}.` });
                refetch();
            },
            onError: (err: any) => {
                const detail = err?.response?.data?.detail || 'Unable to update status.';
                notify({ type: 'error', title: 'Update failed', message: detail });
            }
        });
    };

    const handleCancel = () => {
        cancelBooking(undefined, {
            onSuccess: () => {
                notify({ type: 'success', title: 'Cancelled', message: 'Booking has been cancelled.' });
                refetch();
            },
            onError: (err: any) => {
                const detail = err?.response?.data?.detail || 'Unable to cancel booking.';
                notify({ type: 'error', title: 'Cancel failed', message: detail });
            }
        });
    };

    const handleComplete = () => {
        completeBooking(undefined, {
            onSuccess: () => {
                notify({ type: 'success', title: 'Completed', message: 'Booking marked as completed.' });
                refetch();
            },
            onError: (err: any) => {
                const detail = err?.response?.data?.detail || 'Unable to complete booking.';
                notify({ type: 'error', title: 'Complete failed', message: detail });
            }
        });
    };


    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.Pending: return { bg: colors.status.pending.bg, text: colors.status.pending.text, icon: "time-outline" };
            case BookingStatus.Accepted: return { bg: colors.status.accepted.bg, text: colors.status.accepted.text, icon: "checkmark-circle-outline" };
            case BookingStatus.Declined: return { bg: colors.status.declined.bg, text: colors.status.declined.text, icon: "close-circle-outline" };
            default: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary, icon: "help-circle-outline" };
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
                <Button title="Go Back" onPress={() => router.back()} variant="outline" style={{ marginTop: spacing.md }} />
            </View>
        );
    }

    const counterpartName = isTutor ? booking.studentName : booking.tutorName;
    const statusStyles = getStatusColor(booking.status);
    const modeLabel = booking.preferredMode === 0 ? 'In Person' : booking.preferredMode === 1 ? 'Online' : 'Flexible';
    const priceLabel = booking.pricePerHour ? `£${booking.pricePerHour}/hr` : '£—/hr';
    const dateLabel = booking.preferredDate || 'Flexible Date';

    const showReview = !isTutor && (booking.status === BookingStatus.Accepted || booking.status === BookingStatus.Completed);
    const hasAlreadyReviewed = booking.hasReview || reviewSubmitted;
    const reviewEnabled = !isTutor && booking.status === BookingStatus.Completed && !hasAlreadyReviewed;

    const handleSubmitReview = () => {
        if (!showReview) return;

        if (!reviewEnabled) {
            notify({
                type: 'info',
                title: 'Review locked',
                message: 'Reviews unlock once the booking is marked completed.',
            });
            return;
        }

        const trimmed = reviewComment.trim();
        if (!trimmed) {
            notify({ type: 'error', title: 'Comment required', message: 'Please add a short review comment.' });
            return;
        }

        createReview(
            { bookingRequestId: booking.id, rating: reviewRating, comment: trimmed },
            {
                onSuccess: () => {
                    setReviewSubmitted(true);
                    notify({ type: 'success', title: 'Review submitted', message: 'Thanks for helping the community.' });
                },
                onError: (err: any) => {
                    const detail = err?.response?.data?.detail || 'Unable to submit review.';
                    notify({ type: 'error', title: 'Review failed', message: detail });
                },
            }
        );
    };



    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Stack.Screen options={{
                title: 'Chat & Details',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.neutrals.background },
            }} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.headerContainer}>
                    <View style={styles.infoCard}>
                        <View style={styles.topRow}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>{counterpartName.charAt(0).toUpperCase()}</Text>
                            </View>
                            <View style={styles.headerInfo}>
                                <Text style={styles.headerLabel}>{isTutor ? 'Student' : 'Tutor'}</Text>
                                <Text style={styles.headerName}>{counterpartName}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
                                <Ionicons name={statusStyles.icon as any} size={14} color={statusStyles.text} style={{ marginRight: 4 }} />
                                <Text style={[styles.statusText, { color: statusStyles.text }]}>
                                    {BookingStatus[booking.status]}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Ionicons name="calendar-outline" size={16} color={colors.neutrals.textSecondary} />
                                <Text style={styles.metaText}>{dateLabel}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name={booking.preferredMode === 1 ? "videocam-outline" : "location-outline"} size={16} color={colors.neutrals.textSecondary} />
                                <Text style={styles.metaText}>{modeLabel}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="cash-outline" size={16} color={colors.neutrals.textSecondary} />
                                <Text style={styles.metaText}>{priceLabel}</Text>
                            </View>
                        </View>

                        {/* Action Buttons Area */}
                        {(isTutor && booking.status === BookingStatus.Pending) && (
                            <View style={styles.actionButtons}>
                                <Button title="Accept" onPress={() => handleStatusChange(BookingStatus.Accepted)} variant="secondary" size="sm" style={{ flex: 1 }} isLoading={isResponding} />
                                <Button title="Decline" onPress={() => handleStatusChange(BookingStatus.Declined)} variant="outline" size="sm" style={{ flex: 1, borderColor: colors.error }} textStyle={{ color: colors.error }} isLoading={isResponding} />
                            </View>
                        )}
                        {(!isTutor && (booking.status === BookingStatus.Pending)) && (
                            <View style={styles.actionButtons}>
                                <Button title="Cancel Booking" onPress={handleCancel} variant="outline" size="sm" style={{ flex: 1 }} isLoading={isCancelling} />
                            </View>
                        )}
                        {(!isTutor && booking.status === BookingStatus.Accepted) && (
                            <View style={styles.actionButtons}>
                                <Button title="Pay Now" onPress={() => setShowPayment(true)} variant="primary" size="sm" style={{ flex: 2 }} />
                                <Button title="Cancel" onPress={handleCancel} variant="outline" size="sm" style={{ flex: 1 }} isLoading={isCancelling} />
                            </View>
                        )}
                        {(isTutor && booking.status === BookingStatus.Accepted) && (
                            <View style={styles.actionButtons}>
                                <Button title="Mark Completed" onPress={handleComplete} variant="primary" size="sm" style={{ flex: 1 }} isLoading={isCompleting} />
                            </View>
                        )}
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.messagesContainer}>
                        {messages.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="chatbubbles-outline" size={48} color={colors.neutrals.surfaceAlt} />
                                <Text style={styles.emptyText}>Start the conversation...</Text>
                            </View>
                        ) : (
                            messages.map((msg: BookingMessage) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <View key={msg.id} style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}>
                                        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                                            <Text style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}>{msg.content}</Text>
                                            <View style={styles.bubbleFooter}>
                                                <Text style={[styles.timestamp, isMe ? styles.timeMe : styles.timeOther]}>
                                                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                                {isMe && (
                                                    msg.isRead ? (
                                                        <Text style={styles.readIndicator}>Read</Text>
                                                    ) : (
                                                        <Text style={styles.deliveredIndicator}>Delivered</Text>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        )}

                        {isCounterpartTyping && (
                            <View style={[styles.messageRow, styles.rowOther]}>
                                <View style={[styles.bubble, styles.bubbleOther, styles.typingBubble]}>
                                    <TypingIndicator />
                                </View>
                            </View>
                        )}
                    </View>

                    {showReview && (
                        <View style={{ marginTop: spacing.lg }}>
                            {hasAlreadyReviewed ? (
                                <View style={styles.reviewThanks}>
                                    <Text style={styles.reviewThanksTitle}>Review submitted</Text>
                                    <Text style={styles.reviewThanksBody}>Thanks — your feedback helps students choose confidently.</Text>
                                </View>
                            ) : (
                                <ReviewComposer
                                    rating={reviewRating}
                                    onRatingChange={setReviewRating}
                                    comment={reviewComment}
                                    onCommentChange={setReviewComment}
                                    onSubmit={handleSubmitReview}
                                    isSubmitting={isReviewing}
                                    isEnabled={reviewEnabled}
                                    helperText={
                                        booking.status === BookingStatus.Accepted
                                            ? 'Review unlocks once the booking is completed.'
                                            : undefined
                                    }
                                />
                            )}
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>

                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle-outline" size={28} color={colors.neutrals.textMuted} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.neutrals.textMuted}
                        value={message}
                        onChangeText={handleTypingInput}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!message.trim() || isSending) && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!message.trim() || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Ionicons name="send" size={20} color="#fff" style={{ marginLeft: 2 }} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <PaymentModal
                visible={showPayment}
                bookingId={id!}
                amount={booking.pricePerHour} // Assuming 1 hour for now, logic can be more complex
                onClose={() => setShowPayment(false)}
                onSuccess={() => {
                    setShowPayment(false);
                    notify({ type: 'success', title: 'Payment Confirmed', message: 'The funds are being held securely.' });
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
        backgroundColor: colors.neutrals.background,
        zIndex: 10,
    },
    infoCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    headerInfo: {
        flex: 1,
    },
    headerLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 0.5,
    },
    headerName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    statusText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.border,
        marginVertical: spacing.md,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.md,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    messagesContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingTop: spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl,
        opacity: 0.6,
    },
    emptyText: {
        marginTop: spacing.sm,
        color: colors.neutrals.textSecondary,
    },
    reviewThanks: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    reviewThanksTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginBottom: 4,
    },
    reviewThanksBody: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
    messageRow: {

        width: '100%',
        flexDirection: 'row',
        marginBottom: 8,
    },
    rowMe: {
        justifyContent: 'flex-end',
    },
    rowOther: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
    },
    bubbleMe: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: colors.neutrals.surface,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textMe: {
        color: '#fff',
    },
    textOther: {
        color: colors.neutrals.textPrimary,
    },
    timestamp: {
        fontSize: 9,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    timeMe: {
        color: 'rgba(255,255,255,0.7)',
    },
    timeOther: {
        color: colors.neutrals.textMuted,
    },
    bubbleFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: 2,
    },
    readIndicator: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    deliveredIndicator: {
        fontSize: 10,
        color: colors.neutrals.textSecondary,
        fontStyle: 'italic',
    },
    typingBubble: {
        width: 60,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        paddingBottom: Platform.OS === 'ios' ? 0 : spacing.sm,
        backgroundColor: colors.neutrals.background,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.border,
    },
    attachButton: {
        padding: spacing.sm,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: colors.neutrals.surface,
        borderRadius: 20,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        marginHorizontal: spacing.xs,
        fontSize: 15,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.xs,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    sendButtonDisabled: {
        backgroundColor: colors.neutrals.surfaceAlt,
        shadowOpacity: 0,
        elevation: 0,
    },
    errorText: {
        color: colors.error,
        marginBottom: spacing.md,
    }
});

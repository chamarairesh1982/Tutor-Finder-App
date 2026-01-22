// Web mock for @stripe/stripe-react-native to prevent bundling errors
export const StripeProvider = ({ children }) => children;
export const usePaymentSheet = () => ({
    initPaymentSheet: async () => ({ error: null }),
    presentPaymentSheet: async () => ({ error: null }),
});
export const useStripe = () => ({
    confirmPayment: async () => ({ error: null }),
});
export default {
    StripeProvider,
    usePaymentSheet,
    useStripe,
};

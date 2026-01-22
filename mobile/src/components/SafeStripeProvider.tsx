import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

export function SafeStripeProvider({ children, publishableKey }: { children: any, publishableKey: string }) {
    return (
        <StripeProvider publishableKey={publishableKey}>
            {children}
        </StripeProvider>
    );
}

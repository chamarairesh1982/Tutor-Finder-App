import React from 'react';

export function SafeStripeProvider({ children }: { children: React.ReactNode, publishableKey: string }) {
    // On web, we don't use the native StripeProvider as it causes codegen errors
    return <>{children}</>;
}

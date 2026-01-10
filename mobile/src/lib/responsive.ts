import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const breakpoints = {
    sm: 540,
    md: 768,
    lg: 1024,
    xl: 1280,
};

type BreakpointKey = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export function useBreakpoint() {
    const { width, height } = useWindowDimensions();

    return useMemo(() => {
        const isSm = width >= breakpoints.sm;
        const isMd = width >= breakpoints.md;
        const isLg = width >= breakpoints.lg;
        const isXl = width >= breakpoints.xl;

        const current: BreakpointKey = isXl ? 'xl' : isLg ? 'lg' : isMd ? 'md' : isSm ? 'sm' : 'base';

        return {
            width,
            height,
            current,
            isSm,
            isMd,
            isLg,
            isXl,
        };
    }, [width, height]);
}

export function responsiveValue<T>(values: { base: T; sm?: T; md?: T; lg?: T; xl?: T }, width: number) {
    if (width >= breakpoints.xl && values.xl !== undefined) return values.xl;
    if (width >= breakpoints.lg && values.lg !== undefined) return values.lg;
    if (width >= breakpoints.md && values.md !== undefined) return values.md;
    if (width >= breakpoints.sm && values.sm !== undefined) return values.sm;
    return values.base;
}

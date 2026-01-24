import React from 'react';
import { View, StyleSheet, ScrollView, ViewProps, StyleProp, ViewStyle, Platform, ScrollViewProps } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { spacing, layout, colors } from '../lib/theme';

interface ScreenProps extends ScrollViewProps {
    scrollable?: boolean;
    safe?: boolean;
    edges?: SafeAreaViewProps['edges'];
    backgroundColor?: string;
}

export const Screen = ({
    children,
    scrollable = false,
    safe = true,
    edges = ['left', 'right', 'bottom'],
    backgroundColor = colors.neutrals.background,
    style,
    contentContainerStyle,
    ...props
}: ScreenProps) => {
    const ContainerComponent = safe ? SafeAreaView : View;
    const Wrapper = scrollable ? ScrollView : View;

    return (
        <ContainerComponent edges={edges} style={[styles.flex, { backgroundColor }]}>
            <Wrapper
                {...(scrollable ? props : {})}
                style={[styles.flex, style]}
                contentContainerStyle={[
                    scrollable ? styles.scrollContent : styles.flex,
                    contentContainerStyle,
                ]}
            >
                {children}
            </Wrapper>
        </ContainerComponent>
    );
};

interface ContainerProps extends ViewProps {
    maxWidth?: number;
    padding?: keyof typeof spacing;
    fluid?: boolean;
}

export const Container = ({
    children,
    maxWidth = layout.contentMaxWidth,
    padding = 'md',
    fluid = false,
    style,
    ...props
}: ContainerProps) => {
    return (
        <View
            {...props}
            style={[
                styles.container,
                !fluid && { maxWidth, width: '100%', alignSelf: 'center' },
                { paddingHorizontal: spacing[padding] },
                style,
            ]}
        >
            {children}
        </View>
    );
};

interface SectionProps extends ViewProps {
    paddingVertical?: keyof typeof spacing;
    gap?: keyof typeof spacing;
}

export const Section = ({
    children,
    paddingVertical = 'lg',
    gap,
    style,
    ...props
}: SectionProps) => {
    return (
        <View
            {...props}
            style={[
                { paddingVertical: spacing[paddingVertical] },
                gap && { gap: spacing[gap] },
                style,
            ]}
        >
            {children}
        </View>
    );
};

interface SpacerProps {
    size?: keyof typeof spacing | number; // Support tokens first
    horizontal?: boolean;
}

export const Spacer = ({ size = 'md', horizontal = false }: SpacerProps) => {
    const value = typeof size === 'number' ? size : spacing[size];
    return <View style={horizontal ? { width: value } : { height: value }} />;
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        // No hardcoded centering here, handled by alignSelf in component
    },
});

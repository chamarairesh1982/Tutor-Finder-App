const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const mockPath = path.resolve(__dirname, 'src/lib/stripe-web-mock.js');

// Standard Metro config doesn't have an easy "isWeb" flag, so we use a resolveRequest proxy
// to intercept the Stripe import specifically when bundled for web.
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === '@stripe/stripe-react-native') {
        return {
            type: 'sourceFile',
            filePath: mockPath,
        };
    }

    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }

    // Default resolution
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

import { useState, useEffect } from 'react';

export const useMobileApp = () => {
    const [isMobileApp, setIsMobileApp] = useState(false);

    useEffect(() => {
        // Check if running in a WebView explicitly injected with ReactNativeWebView
        // or if the User Agent suggests it's the mobile app (if we knew the UA).
        // For now, we rely on standard React Native WebView detection.
        const isRNWebView = typeof window !== 'undefined' && (window as any).ReactNativeWebView;

        // Also check local storage or session storage validation if the app sets a flag
        const isAppStorage = typeof window !== 'undefined' && window.sessionStorage.getItem('isMobileApp') === 'true';

        if (isRNWebView || isAppStorage) {
            setIsMobileApp(true);
        }
    }, []);

    return isMobileApp;
};

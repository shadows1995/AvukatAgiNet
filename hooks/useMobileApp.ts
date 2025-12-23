import { useState, useEffect } from 'react';

export const useMobileApp = () => {
    // Initialize directly from storage to avoid flash on reload
    const [isMobileApp, setIsMobileApp] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.sessionStorage.getItem('isMobileApp') === 'true';
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Check URL Param (Priority)
        const urlParams = new URLSearchParams(window.location.search);
        const urlFlag = urlParams.get('isMobileApp');

        // 2. Check React Native
        const isRNWebView = (window as any).ReactNativeWebView;

        // 3. Check iOS/Swift WebKit Message Handlers (Common in iOS WebViews)
        const isWKWebView = (window as any).webkit && (window as any).webkit.messageHandlers;

        if (urlFlag === 'true' || isRNWebView || isWKWebView) {
            setIsMobileApp(true);
            window.sessionStorage.setItem('isMobileApp', 'true');
        }
    }, []);

    return isMobileApp;
};

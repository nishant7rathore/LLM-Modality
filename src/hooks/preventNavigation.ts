import { useEffect } from 'react';

export const usePreventNavigation = (message?: string) => {
    useEffect(() => {
        // Prevent back navigation
        window.history.pushState(null, "", window.location.pathname);
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.pathname);
            if (message) {
                alert(message);
            }
        };
        
        window.addEventListener("popstate", handlePopState);
        
        // Also prevent refresh/closing
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        
        window.addEventListener("beforeunload", handleBeforeUnload);
        
        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [message]);
};
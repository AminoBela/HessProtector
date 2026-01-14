"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PrivacyContextType {
    isBlurred: boolean;
    toggleBlur: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
    // Default to true for privacy, or false? Usually false.
    // Let's persist it in localStorage if possible, or just default false.
    const [isBlurred, setIsBlurred] = useState(false);

    const toggleBlur = () => setIsBlurred(prev => !prev);

    return (
        <PrivacyContext.Provider value={{ isBlurred, toggleBlur }}>
            {children}
        </PrivacyContext.Provider>
    );
}

export function usePrivacy() {
    const context = useContext(PrivacyContext);
    if (context === undefined) {
        throw new Error('usePrivacy must be used within a PrivacyProvider');
    }
    return context;
}

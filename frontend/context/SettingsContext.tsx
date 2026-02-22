"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SettingsContextType {
    theme: string;
    setTheme: (theme: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState("dark");
    const [language, setLanguage] = useState("fr");

    // Load from local storage on mount (optional)
    useEffect(() => {
        const savedTheme = localStorage.getItem("hess_theme");
        const savedLang = localStorage.getItem("hess_lang");

        const initialTheme = savedTheme || "dark";
        setTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        if (savedLang) setLanguage(savedLang);
    }, []);

    const handleSetTheme = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem("hess_theme", newTheme);
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const handleSetLang = (newLang: string) => {
        setLanguage(newLang);
        localStorage.setItem("hess_lang", newLang);
    };

    return (
        <SettingsContext.Provider
            value={{
                theme,
                setTheme: handleSetTheme,
                language,
                setLanguage: handleSetLang
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}

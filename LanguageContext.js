import React, { createContext, useState, useEffect, useContext } from 'react';
import en from './locales/en/common';
import ar from './locales/ar/common';
import { parse, serialize } from 'cookie';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(typeof window !== 'undefined' ? localStorage.getItem('selectedLanguage') || 'AR' : '');
 

    const switchLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    };
    useEffect(() => {
        localStorage.setItem('selectedLanguage', language);

    }, [language]); 
    useEffect(() => {
        const savedLanguage = parse(document.cookie).selectedLanguage;
        setLanguage(savedLanguage || 'AR');
    }, []);

    useEffect(() => {
        const cookieValue = serialize('selectedLanguage', language);
        document.cookie = cookieValue;
    }, [language]);
    
    const getTranslations = () => {
        switch (language) {
            case 'EN':
                return { translations: en, lang: 'en', dir: 'ltr', code: 'EN' };
            case 'AR':
                return { translations: ar, lang: 'ar', dir: 'rtl', code: 'AR' };
            default:
                return { translations: ar, lang: 'ar', dir: 'rtl', code: 'AR' };
        }
    };

    const { translations, lang, dir, code } = getTranslations();

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, translations, lang, dir, code }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguageContext = () => useContext(LanguageContext)
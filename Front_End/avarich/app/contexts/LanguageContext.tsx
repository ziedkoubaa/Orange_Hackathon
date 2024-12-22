// app/contexts/LanguageContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

type Language = 'ENG' | 'TUN';

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'ENG',
  toggleLanguage: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<ProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ENG');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ENG' ? 'TUN' : 'ENG'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

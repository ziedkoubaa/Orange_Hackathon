// app/contexts/AvatarContext.tsx

import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the type for avatar
type AvatarType = 'male' | 'female';

// Define the context type
interface AvatarContextProps {
  avatar: AvatarType;
  toggleAvatar: () => void;
}

// Create the context
export const AvatarContext = createContext<AvatarContextProps>({
  avatar: 'female',
  toggleAvatar: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const AvatarProvider: React.FC<ProviderProps> = ({ children }) => {
  const [avatar, setAvatar] = useState<AvatarType>('female');

  const toggleAvatar = () => {
    setAvatar((prev) => (prev === 'male' ? 'female' : 'male'));
  };

  return (
    <AvatarContext.Provider value={{ avatar, toggleAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

// frontend/src/context/AuthContext.tsx
import React, { createContext } from 'react';

// No need for token state or localStorage if using HttpOnly cookies
// This context can remain if you want to provide login/logout actions or
// other authentication-related functions to children, but it won't hold the token itself.
interface AuthContextProps {
  // You might add login/logout methods here later if needed
  // login: (email: string, password: string) => Promise<void>;
  // logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({}); // Empty value for now

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Removed useState for token and useEffect for localStorage
  return (
    <AuthContext.Provider value={{ /* potentially login/logout functions here */ }}>
      {children}
    </AuthContext.Provider>
  );
};
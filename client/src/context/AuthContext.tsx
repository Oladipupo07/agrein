import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const defaultUser: User = {
  id: 'usr_buyer_77',
  email: 'chief.buyer@ekohotels.ng',
  fullName: 'Chief Procurement Officer',
  role: 'buyer',
  phoneNumber: '+234 803 881 9900',
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  role: 'buyer',
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);

  const login = (role: UserRole) => {
    setUser({
      id: `usr_${role}_${Date.now()}`,
      email: `${role}@agrein.ng`,
      fullName: role === 'farmer' ? 'Alhaji Sanusi Garba (Farmer)' : role === 'delivery_partner' ? 'Kwik Logistics Driver' : role === 'admin' ? 'Platform Administrator' : 'Enterprise Buyer',
      role,
      phoneNumber: '+234 802 000 1122',
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'buyer', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

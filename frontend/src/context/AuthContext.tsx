import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userDesignation: string;
  isCitizen: boolean;
  isOfficer: boolean;
  isDistrictAuthority: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('DISTRICT_AUTHORITY');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const getProfile = () => {
    switch (role) {
      case 'CITIZEN':
        return { name: 'P. Rajesh Kumar', designation: 'Citizen Resident / Ward Committee' };
      case 'FIELD_OFFICER':
        return { name: 'Shri R. K. Verma, AEE', designation: 'Assistant Executive Engineer, PRED' };
      case 'DISTRICT_AUTHORITY':
        return { name: 'Smt. Ananya Sharma, IAS', designation: 'District Collector & Planning Officer' };
      case 'ADMIN':
        return { name: 'Dr. V. K. Malhotra', designation: 'State Nodal Officer & System Admin (MoSPI)' };
    }
  };

  const profile = getProfile();

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        userName: profile.name,
        userDesignation: profile.designation,
        isCitizen: role === 'CITIZEN',
        isOfficer: role === 'FIELD_OFFICER',
        isDistrictAuthority: role === 'DISTRICT_AUTHORITY',
        isAdmin: role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

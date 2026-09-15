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
  isVigilanceAuditor: boolean;
  isContractor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_ROLES: UserRole[] = ['CITIZEN', 'FIELD_OFFICER', 'DISTRICT_AUTHORITY', 'ADMIN', 'VIGILANCE_AUDITOR', 'CONTRACTOR'];

const getInitialRole = (): UserRole => {
  try {
    const saved = localStorage.getItem('mplad_user_role') as UserRole | null;
    if (saved && VALID_ROLES.includes(saved)) {
      return saved;
    }
  } catch {}
  return 'DISTRICT_AUTHORITY';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(getInitialRole);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('mplad_user_role', newRole);
    } catch {}
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
      case 'VIGILANCE_AUDITOR':
        return { name: 'Shri Amitabh Sanyal, CTE', designation: 'Chief Technical Examiner, State Technical Vigilance Wing (CVC Norms)' };
      case 'CONTRACTOR':
        return { name: 'M/s Sri Venkateswara Infra Projects Ltd', designation: 'Class-1 Registered EPC Contractor (GSTIN: 37AAECS1234F1Z5)' };
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
        isVigilanceAuditor: role === 'VIGILANCE_AUDITOR',
        isContractor: role === 'CONTRACTOR',
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

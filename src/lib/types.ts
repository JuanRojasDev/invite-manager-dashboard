
// User roles
export type UserRole = 'admin' | 'guest';

// User profile
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
  avatar_url?: string;
}

// Invitation status
export type InvitationStatus = 'pending' | 'accepted' | 'expired';

// Invitation
export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: InvitationStatus;
  created_at: string;
  created_by: string;
  accepted_at?: string;
}

// Auth context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

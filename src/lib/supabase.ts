import { toast } from "sonner";
import { User, UserRole, Invitation } from './types';

// Initialize mock data from localStorage or use defaults
const getInitialMockUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem('mockUsers');
    return storedUsers ? JSON.parse(storedUsers) : [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as UserRole,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      {
        id: '2',
        email: 'guest@example.com',
        name: 'Guest User',
        role: 'guest' as UserRole,
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
      }
    ];
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as UserRole,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      {
        id: '2',
        email: 'guest@example.com',
        name: 'Guest User',
        role: 'guest' as UserRole,
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
      }
    ];
  }
};

const getInitialMockInvitations = (): Invitation[] => {
  try {
    const storedInvitations = localStorage.getItem('mockInvitations');
    return storedInvitations ? JSON.parse(storedInvitations) : [
      {
        id: '1',
        email: 'pending@example.com',
        role: 'guest',
        token: 'demo-invitation-token',
        status: 'pending',
        created_at: '2023-05-01T00:00:00Z',
        created_by: '1',
      }
    ];
  } catch (error) {
    console.error('Error loading invitations from localStorage:', error);
    return [
      {
        id: '1',
        email: 'pending@example.com',
        role: 'guest',
        token: 'demo-invitation-token',
        status: 'pending',
        created_at: '2023-05-01T00:00:00Z',
        created_by: '1',
      }
    ];
  }
};

// Load initial data from localStorage
let mockUsers: User[] = getInitialMockUsers();
let mockInvitations: Invitation[] = getInitialMockInvitations();

// Helper functions to persist data to localStorage
const persistUsers = () => {
  try {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

const persistInvitations = () => {
  try {
    localStorage.setItem('mockInvitations', JSON.stringify(mockInvitations));
  } catch (error) {
    console.error('Error saving invitations to localStorage:', error);
  }
};

// Simulates network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    // Simulate network request
    await delay(800);
    
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Mock authentication logic
    if (
      (email === 'admin@example.com' && password === 'adminpass') ||
      (email === 'guest@example.com' && password === 'guestpass')
    ) {
      console.log('Mock sign in successful');
      return { user: mockUsers.find(u => u.email === email) };
    } else {
      throw new Error('Invalid email or password');
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast.error(`Sign in failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Simulate network request
    await delay(500);
    console.log('Mock sign out successful');
    return {};
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast.error(`Sign out failed: ${error.message || 'Unknown error'}`);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // Check local storage for mock authentication
    const storedUser = localStorage.getItem('mockCurrentUser');
    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }
    return null;
  } catch (error: any) {
    console.error(`Error getting current user: ${error.message}`);
    return null;
  }
};

// User related functions
export const getUserProfile = async (userId: string) => {
  try {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    return user || null;
  } catch (error: any) {
    console.error(`Error fetching user profile: ${error.message}`);
    return null;
  }
};

// Invitation related functions
export const createInvitation = async (email: string, role: UserRole = 'guest') => {
  try {
    await delay(500);
    const token = Math.random().toString(36).substring(2, 15);
    const currentUser = await getCurrentUser();
    
    if (!currentUser) throw new Error('No authenticated user found');
    
    const newInvitation: Invitation = {
      id: (mockInvitations.length + 1).toString(),
      email,
      role,
      token,
      status: 'pending',
      created_at: new Date().toISOString(),
      created_by: currentUser.id
    };
    
    // Add to mock invitations
    mockInvitations.push(newInvitation);
    
    // Create a payload for the email
    const invitationUrl = `${window.location.origin}/invitation/${token}`;
    console.log('Email would be sent with invitation URL:', invitationUrl);
    
    // Save to localStorage
    persistInvitations();
    
    toast.success(`Invitation sent to ${email}`);
    return newInvitation;
  } catch (error: any) {
    toast.error(`Error creating invitation: ${error.message}`);
    throw error;
  }
};

export const getInvitationByToken = async (token: string) => {
  try {
    await delay(300);
    return mockInvitations.find(inv => inv.token === token) || null;
  } catch (error: any) {
    console.error(`Error fetching invitation: ${error.message}`);
    return null;
  }
};

export const acceptInvitation = async (token: string, password: string) => {
  try {
    await delay(800);
    const invitation = await getInvitationByToken(token);
    
    if (!invitation) throw new Error('Invalid or expired invitation');
    if (invitation.status !== 'pending') throw new Error('Invitation has already been used');
    
    // Create the new user
    const newUserId = (mockUsers.length + 1).toString();
    const newUser = {
      id: newUserId,
      email: invitation.email,
      name: invitation.email.split('@')[0],
      role: invitation.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${invitation.email}`
    };
    
    // Add to mock users
    mockUsers.push(newUser);
    
    // Update invitation status
    const invIndex = mockInvitations.findIndex(inv => inv.token === token);
    if (invIndex >= 0) {
      mockInvitations[invIndex] = {
        ...mockInvitations[invIndex],
        status: 'accepted',
        accepted_at: new Date().toISOString()
      };
    }
    
    // Send welcome email (simulated)
    console.log(`Welcome email would be sent to ${invitation.email}`);
    
    // Save to localStorage
    persistUsers();
    persistInvitations();
    
    toast.success('Invitation accepted successfully!');
    return newUser;
  } catch (error: any) {
    toast.error(`Error accepting invitation: ${error.message}`);
    throw error;
  }
};

export const getAllInvitations = async () => {
  try {
    await delay(500);
    return [...mockInvitations].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error: any) {
    console.error(`Error fetching invitations: ${error.message}`);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    await delay(500);
    return [...mockUsers].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error: any) {
    console.error(`Error fetching users: ${error.message}`);
    return [];
  }
};

// Helper function to store the current user in localStorage for the mock auth system
export const setMockCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('mockCurrentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('mockCurrentUser');
  }
};

// No longer need the supabase client since we're using a mock system
export const supabase = {
  auth: {
    getUser: async () => {
      const user = await getCurrentUser();
      return { data: { user }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('mockCurrentUser');
      return { error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const result = await signIn(email, password);
        if (result.user) {
          setMockCurrentUser(result.user as User);
        }
        return { data: result, error: null };
      } catch (error: any) {
        return { data: null, error };
      }
    }
  },
  from: (table: string) => {
    return {
      select: (fields: string) => ({
        eq: (field: string, value: any) => ({
          single: async () => {
            await delay(300);
            
            if (table === 'profiles') {
              const user = mockUsers.find(u => u[field as keyof typeof u] === value);
              return { data: user, error: null };
            }
            
            if (table === 'invitations') {
              const invitation = mockInvitations.find(i => i[field as keyof Invitation] === value);
              return { data: invitation, error: null };
            }
            
            return { data: null, error: null };
          },
          order: () => ({
            data: mockUsers,
            error: null
          })
        })
      }),
      insert: async (items: any[]) => {
        await delay(500);
        
        if (table === 'invitations') {
          const newInvitation = { ...items[0], id: (mockInvitations.length + 1).toString() };
          mockInvitations.push(newInvitation as any);
          persistInvitations();
          return { 
            data: newInvitation, 
            error: null, 
            select: () => ({ 
              single: () => ({ data: newInvitation, error: null }) 
            }) 
          };
        }
        
        if (table === 'profiles') {
          const newProfile = { ...items[0] };
          const existingUserIndex = mockUsers.findIndex(u => u.id === newProfile.id);
          
          if (existingUserIndex >= 0) {
            mockUsers[existingUserIndex] = { ...mockUsers[existingUserIndex], ...newProfile };
          } else {
            mockUsers.push(newProfile as any);
          }
          
          persistUsers();
          return { data: newProfile, error: null };
        }
        
        return { data: null, error: null };
      },
      update: async (item: any) => {
        await delay(500);
        
        if (table === 'invitations') {
          const invIndex = mockInvitations.findIndex(inv => inv.id === item.id);
          if (invIndex >= 0) {
            mockInvitations[invIndex] = { ...mockInvitations[invIndex], ...item };
            persistInvitations();
          }
          return { data: mockInvitations[invIndex], error: null };
        }
        
        return { data: null, error: null };
      }
    };
  }
};

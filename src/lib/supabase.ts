
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { User, UserRole, Invitation } from './types';

// These would come from environment variables in a production app
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(`Authentication error: ${error.message}`);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    toast.error(`Sign out error: ${error.message}`);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    // Get the user's role from the profiles table
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      return {
        ...data.user,
        role: profileData?.role as UserRole
      };
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as User;
  } catch (error: any) {
    console.error(`Error fetching user profile: ${error.message}`);
    return null;
  }
};

// Invitation related functions
export const createInvitation = async (email: string, role: UserRole = 'guest') => {
  try {
    // Generate a unique token
    const token = crypto.randomUUID();
    const currentUser = await getCurrentUser();
    
    if (!currentUser) throw new Error('No authenticated user found');
    
    const { data, error } = await supabase
      .from('invitations')
      .insert([
        { 
          email, 
          role, 
          token, 
          created_by: currentUser.id,
          status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`Invitation sent to ${email}`);
    return data as Invitation;
  } catch (error: any) {
    toast.error(`Error creating invitation: ${error.message}`);
    throw error;
  }
};

export const getInvitationByToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error) throw error;
    return data as Invitation;
  } catch (error: any) {
    console.error(`Error fetching invitation: ${error.message}`);
    return null;
  }
};

export const acceptInvitation = async (token: string, password: string) => {
  try {
    const invitation = await getInvitationByToken(token);
    
    if (!invitation) throw new Error('Invalid or expired invitation');
    if (invitation.status !== 'pending') throw new Error('Invitation has already been used');
    
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
    });
    
    if (authError) throw authError;
    
    // Create a profile for the user
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: invitation.email,
          role: invitation.role,
          name: invitation.email.split('@')[0], // Default name from email
        }]);
      
      if (profileError) throw profileError;
      
      // Update invitation status
      const { error: invitationError } = await supabase
        .from('invitations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);
      
      if (invitationError) throw invitationError;
      
      toast.success('Invitation accepted successfully!');
      return authData.user;
    }
    
    throw new Error('Failed to create user');
  } catch (error: any) {
    toast.error(`Error accepting invitation: ${error.message}`);
    throw error;
  }
};

export const getAllInvitations = async () => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Invitation[];
  } catch (error: any) {
    console.error(`Error fetching invitations: ${error.message}`);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as User[];
  } catch (error: any) {
    console.error(`Error fetching users: ${error.message}`);
    return [];
  }
};

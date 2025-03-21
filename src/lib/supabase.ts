import { toast } from "sonner";
import { User, UserRole, Invitation } from './types';
import { supabase } from "@/integrations/supabase/client";

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  if (data.user) {
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) throw profileError;
    
    console.log('Sign in successful:', profileData);
    return { user: profileData as User };
  }
  
  throw new Error('Failed to get user profile');
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return {};
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }
      
      return profileData as User;
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
    const token = Math.random().toString(36).substring(2, 15);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!userData.user) throw new Error('No authenticated user found');
    
    const { data, error } = await supabase
      .from('invitations')
      .insert([
        {
          email,
          role,
          token,
          status: 'pending',
          created_by: userData.user.id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Create a payload for the email
    const invitationUrl = `${window.location.origin}/invitation/${token}`;
    console.log('Email would be sent with invitation URL:', invitationUrl);
    
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
    
    // Create the new user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password: password
    });
    
    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error('Failed to create user account');
    }
    
    // Create profile for the new user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: invitation.email,
          name: invitation.email.split('@')[0],
          role: invitation.role,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${invitation.email}`
        }
      ]);
    
    if (profileError) throw profileError;
    
    // Update invitation status
    const { error: invitationError } = await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);
    
    if (invitationError) throw invitationError;
    
    // Send welcome email (simulated)
    console.log(`Welcome email would be sent to ${invitation.email}`);
    
    toast.success('Invitation accepted successfully!');
    
    // Get the complete user profile
    const { data: profileData, error: getUserError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (getUserError) throw getUserError;
    
    return profileData as User;
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

// Helper function to store the current user in localStorage for the mock auth system
export const setMockCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('mockCurrentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('mockCurrentUser');
  }
};

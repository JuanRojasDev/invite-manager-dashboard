
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, AuthContextType } from '@/lib/types';
import { getCurrentUser, signIn as supabaseSignIn, signOut as supabaseSignOut } from '@/lib/supabase';
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up an auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session) {
          try {
            const user = await getCurrentUser();
            setUser(user);
          } catch (error) {
            console.error('Error getting user after auth change:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log('Found existing session:', data.session);
          const user = await getCurrentUser();
          setUser(user);
        } else {
          console.log('No existing session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData = await getCurrentUser();
        setUser(userData);
        toast.success(`Welcome back, ${userData?.email || 'User'}!`);
        navigate('/dashboard');
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(`Sign in failed: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseSignOut();
      setUser(null);
      toast.success('You have been signed out');
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(`Sign out failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

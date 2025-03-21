
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, AuthContextType } from '@/lib/types';
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

  // Helper function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as User;
    } catch (error: any) {
      console.error(`Error in fetchUserProfile: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    // First set up an auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session) {
          try {
            const userData = await fetchUserProfile(session.user.id);
            if (userData) {
              setUser(userData);
            } else {
              // If we can't find a profile but have a session, create a basic user object
              // This handles cases where the profile might not exist yet
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: 'guest', // Default role
                created_at: new Date().toISOString(),
              });
            }
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
          const userData = await fetchUserProfile(data.session.user.id);
          if (userData) {
            setUser(userData);
          } else {
            // Create basic user if profile not found
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || '',
              role: 'guest',
              created_at: new Date().toISOString(),
            });
          }
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
        // Get user profile or create basic user object if profile not found
        const userData = await fetchUserProfile(data.user.id);
        if (userData) {
          setUser(userData);
        } else {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            role: 'guest',
            created_at: new Date().toISOString(),
          });
        }
        
        toast.success(`Welcome back, ${email}!`);
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
      await supabase.auth.signOut();
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

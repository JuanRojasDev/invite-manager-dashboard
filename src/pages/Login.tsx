
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContainer';
import { LoginForm } from '@/components/LoginForm';
import { NavBar } from '@/components/NavBar';
import { Skeleton } from '@/components/ui/skeleton';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6 p-8 border rounded-lg shadow-sm bg-card animate-pulse">
            <Skeleton className="h-10 w-3/4 mx-auto rounded-md" />
            <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 animate-fadeIn">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;

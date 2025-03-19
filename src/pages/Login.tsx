
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContainer';
import { LoginForm } from '@/components/LoginForm';
import { NavBar } from '@/components/NavBar';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

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

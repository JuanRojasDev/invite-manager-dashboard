
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContainer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { GuestDashboard } from '@/components/GuestDashboard';
import { NavBar } from '@/components/NavBar';

const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in and not loading, redirect to login page
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login due to the useEffect above
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 py-6 animate-fadeIn">
        {isAdmin ? <AdminDashboard /> : <GuestDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;

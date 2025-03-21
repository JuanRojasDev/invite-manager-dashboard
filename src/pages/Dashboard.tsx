
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContainer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { GuestDashboard } from '@/components/GuestDashboard';
import { NavBar } from '@/components/NavBar';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
              </div>
              <Skeleton className="h-60 rounded-lg" />
            </div>
          </div>
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


import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContainer';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-small-black/[0.02] -z-10" />
          <div
            className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl"
            aria-hidden="true"
          />
          
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Beautifully Simple
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Invitation Manager
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                A streamlined platform for managing invitations, designed with simplicity and functionality in mind.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {user ? (
                <Button
                  size="lg"
                  className="animate-pulse"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm transition-all hover:shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.7439 5.3109C11.1168 5.02803 11.5604 4.87891 12.0161 4.87891C12.4718 4.87891 12.9154 5.02803 13.2882 5.3109L20.5971 10.6432C20.9699 10.9261 21.2546 11.3113 21.4215 11.7517C21.5883 12.1921 21.6309 12.6705 21.5443 13.1349L19.9286 20.239C19.8423 20.7024 19.6318 21.1341 19.3202 21.4881C19.0086 21.842 18.6087 22.1045 18.1674 22.25H5.86476C5.42347 22.1045 5.02358 21.842 4.71201 21.4881C4.40044 21.1341 4.18985 20.7024 4.10354 20.239L2.48785 13.1349C2.40123 12.6705 2.44387 12.1921 2.61069 11.7517C2.77751 11.3113 3.06218 10.9261 3.43507 10.6432L10.7439 5.3109Z" strokeWidth="2" />
                      <path d="M12 15V11" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 19.01L12.01 18.9989" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Admin Dashboard</h3>
                  <p className="text-muted-foreground">
                    A powerful dashboard for administrators to manage invitations and users.
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm transition-all hover:shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Invitation System</h3>
                  <p className="text-muted-foreground">
                    Generate and manage invitations with ease. Send via URL or email.
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm transition-all hover:shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 5v14H5V5h14Zm0 0H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path d="M17.5 17.5c-1.2-1.7-3.1-2.8-5.5-2.8-2.4 0-4.3 1.1-5.5 2.8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">User Management</h3>
                  <p className="text-muted-foreground">
                    Track and manage users with different roles and permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            Invitation Manager &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
              GitHub
            </a>
            <a href="#" className="text-sm hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

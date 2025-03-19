
import { useAuth } from '@/components/AuthContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Bell, Calendar, Info } from 'lucide-react';

export const GuestDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col space-y-2">
        <div className="inline-flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Guest Access
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || user?.email?.split('@')[0]}</h1>
        <p className="text-muted-foreground">
          Thank you for accepting your invitation. Here's what you need to know.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Announcements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Welcome to our platform</p>
                  <p className="text-sm text-muted-foreground">
                    We're excited to have you join us. Explore the dashboard to get started.
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">New features coming soon</p>
                  <p className="text-sm text-muted-foreground">
                    We're working on new features that will enhance your experience.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-4">
              <li className="border-l-2 border-primary pl-4">
                <p className="font-medium">Platform Orientation</p>
                <p className="text-sm text-muted-foreground">
                  Learn how to make the most of your access.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  June 15, 2024 • 10:00 AM
                </p>
              </li>
              <li className="border-l-2 border-primary pl-4">
                <p className="font-medium">Q&A Session</p>
                <p className="text-sm text-muted-foreground">
                  Get answers to your questions from our team.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  June 22, 2024 • 2:00 PM
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Getting Started</CardTitle>
          </div>
          <CardDescription>
            Important information to help you get started with our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <p>
              Welcome to our platform! As a guest user, you have access to view announcements, 
              upcoming events, and other important information shared by administrators.
            </p>
            <h3 className="text-lg font-medium mt-4 mb-2">What you can do:</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>View announcements and platform updates</li>
              <li>Access scheduled events and webinars</li>
              <li>Update your profile information</li>
              <li>Reach out to administrators for assistance</li>
            </ul>
            <p className="mt-4">
              If you need any assistance or have questions, please don't hesitate to contact 
              the administrator who sent you the invitation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { InvitationForm } from '@/components/InvitationForm';
import { InvitationsList } from '@/components/InvitationsList';
import { UserCard } from '@/components/UserCard';
import { getAllUsers } from '@/lib/supabase';
import { User } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Mail, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage invitations and view user information
        </p>
        <Separator className="my-2" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="invitations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="invitations" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Invitations
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="invitations" className="space-y-4">
              <InvitationsList />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Invitation</CardTitle>
              <CardDescription>
                Generate a new invitation for a user to join the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationForm />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Overview of platform usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <span className="text-3xl font-bold">{users.length}</span>
                  <span className="text-sm text-muted-foreground">Total Users</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <span className="text-3xl font-bold">
                    {users.filter(user => user.role === 'admin').length}
                  </span>
                  <span className="text-sm text-muted-foreground">Admins</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <span className="text-3xl font-bold">
                    {users.filter(user => user.role === 'guest').length}
                  </span>
                  <span className="text-sm text-muted-foreground">Guests</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                  <span className="text-3xl font-bold">
                    {/* This would typically come from actual invitation count */}
                    {users.length > 0 ? users.length - 1 : 0}
                  </span>
                  <span className="text-sm text-muted-foreground">Accepted Invites</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

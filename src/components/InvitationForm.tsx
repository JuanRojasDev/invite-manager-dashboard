
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/lib/types';
import { createInvitation } from '@/lib/supabase';
import { Check, Copy, Mail, Send } from 'lucide-react';

export const InvitationForm = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState<{ token: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const result = await createInvitation(email, role);
      
      const invitationUrl = `${window.location.origin}/invitation/${result.token}`;
      setInvitation({
        token: result.token,
        url: invitationUrl,
      });
      
      toast.success(`Invitation created for ${email}`);
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast.error(`Failed to create invitation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (invitation) {
      navigator.clipboard.writeText(invitation.url);
      setCopied(true);
      toast.success('Invitation link copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleSendEmail = () => {
    if (invitation) {
      // In a real application, this would call an API to send an email
      // For now, we'll just simulate it
      toast.success(`Invitation email sent to ${email}`);
      
      // Reset the form after sending
      setEmail('');
      setRole('guest');
      setInvitation(null);
    }
  };

  return (
    <div className="space-y-4">
      {!invitation ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>User role</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="guest" id="guest" />
                <Label htmlFor="guest" className="cursor-pointer">Guest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Invitation'}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm font-medium mb-2">Invitation link:</p>
            <p className="text-sm break-all bg-background p-2 rounded border">
              {invitation.url}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
            
            <Button
              type="button"
              className="flex-1"
              onClick={handleSendEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setEmail('');
              setRole('guest');
              setInvitation(null);
            }}
          >
            Create Another
          </Button>
        </div>
      )}
    </div>
  );
};

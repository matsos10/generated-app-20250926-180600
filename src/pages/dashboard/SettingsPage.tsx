import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { SubscriptionTier, User } from '@shared/types';
import { cn } from '@/lib/utils';
const subscriptionTiers: { name: SubscriptionTier; price: string; description: string }[] = [
  { name: 'free', price: '$0/mo', description: 'Basic features for individuals.' },
  { name: 'pro', price: '$99/mo', description: 'Advanced features for power users.' },
  { name: 'premium', price: 'Contact Us', description: 'Custom solutions for enterprises.' },
];
export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSubscription, setIsSavingSubscription] = useState(false);
  const handleProfileSave = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const updatedUser = await api<Omit<User, 'passwordHash'>>('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ email: user.email, name }),
      });
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };
  const handleSubscriptionChange = async (tier: SubscriptionTier) => {
    if (!user || tier === 'premium') return;
    setIsSavingSubscription(true);
    try {
      const updatedUser = await api<Omit<User, 'passwordHash'>>('/api/users/me/subscription', {
        method: 'PATCH',
        body: JSON.stringify({ email: user.email, subscriptionTier: tier }),
      });
      updateUser(updatedUser);
      toast.success(`Subscription changed to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`);
    } catch (error) {
      toast.error('Failed to change subscription.');
    } finally {
      setIsSavingSubscription(false);
    }
  };
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} disabled />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleProfileSave} disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>Manage your billing and subscription details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionTiers.map((tier) => (
              <Card key={tier.name} className={cn(user?.subscriptionTier === tier.name && 'border-primary')}>
                <CardHeader>
                  <CardTitle className="capitalize">{tier.name}</CardTitle>
                  <p className="text-2xl font-bold">{tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardFooter>
                  {user?.subscriptionTier === tier.name ? (
                    <Button disabled className="w-full">Current Plan</Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSubscriptionChange(tier.name)}
                      disabled={isSavingSubscription || tier.name === 'premium'}
                    >
                      {isSavingSubscription ? 'Updating...' : 'Select Plan'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
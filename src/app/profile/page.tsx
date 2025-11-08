import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { logout } from '@/components/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { LogoutButton } from '@/components/logout-button';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-in fade-in duration-500">
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">Welcome to your profile page. More features coming soon!</p>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}

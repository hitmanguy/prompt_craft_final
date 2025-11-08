import { notFound } from 'next/navigation';
import Image from 'next/image';
import { mockItems } from '@/lib/mock-data';
import { getUser } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Calendar, Tag, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { MapView } from '@/components/map-view';
import { Chat } from '@/components/chat';
import type { Item } from '@/lib/types';


async function getItem(id: string): Promise<(Item & { receiverId: string }) | undefined> {
  // In a real app, this would be a database query.
  // The receiverId would be the person who posted the item.
  const item = mockItems.find((item) => item.id === id);
  if (!item) return undefined;
  return { ...item, receiverId: item.userId };
}

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);
  const user = await getUser();

  if (!item) {
    notFound();
  }

  const isOwner = user?.id === item.userId;

  const ContactOrChat = () => {
    if (!user) {
      return (
        <Card className="mt-6 border-accent/50 bg-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-accent-foreground/90">
              <ShieldAlert className="h-5 w-5 text-accent" />
              Login to Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent-foreground/80">
              For security, you must be logged in to chat with the owner of this item.
            </p>
            <Button asChild className="mt-4" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <a href="/login">Log In to Chat</a>
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    if (isOwner) {
      return (
         <Card className="mt-6 bg-secondary/50">
            <CardHeader>
                <CardTitle>Your Listing</CardTitle>
                <CardDescription>This is your item listing. You can manage chats with other users here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Chat itemId={item.id} senderId={user.id} receiverId={item.receiverId} isOwner={true} />
            </CardContent>
        </Card>
      )
    }

    return <Chat itemId={item.id} senderId={user.id} receiverId={item.receiverId} isOwner={false} />;
  }


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 md:h-full min-h-[300px]">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint={item.imageHint}
            />
            <Badge
              className={cn(
                "absolute top-4 left-4 text-sm capitalize",
                item.status === 'lost' ? 'bg-destructive' : 'bg-green-600'
              )}
            >
              {item.status}
            </Badge>
          </div>
          <div className="flex flex-col p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-headline text-3xl">{item.name}</CardTitle>
              <CardDescription className="text-base">{item.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow space-y-4 px-0">
               <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                <div className="flex-1">
                  <span className="font-medium">{item.location.name}</span>
                   <div className="mt-2 rounded-lg overflow-hidden h-40">
                     <MapView location={item.location} />
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="font-medium">
                  {item.status === 'lost' ? 'Lost' : 'Found'} {formatDate(item.date)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Tag className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="font-medium">{item.category}</span>
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>

            <div className="mt-auto pt-6">
              <ContactOrChat />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

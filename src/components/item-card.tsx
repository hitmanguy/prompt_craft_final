import Image from 'next/image';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import type { Item } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';

export function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <CardHeader className="p-0">
        <Link href={`/items/${item.id}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={item.imageHint}
            />
            <Badge
              className={cn(
                "absolute top-2 right-2 text-xs capitalize",
                item.status === 'lost' ? 'bg-destructive/90' : 'bg-green-600/90'
              )}
            >
              {item.status}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-1 truncate">
          <Link href={`/items/${item.id}`} className="hover:text-primary transition-colors">{item.name}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{item.location.name}</span>
        </div>
        <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.date)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

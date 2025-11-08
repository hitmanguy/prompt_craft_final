import { ItemCard } from '@/components/item-card';
import { mockItems } from '@/lib/mock-data';
import type { Item } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ItemMapView } from '@/components/item-map-view';

export default function Home() {
  const items: Item[] = mockItems;

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">Find What's Lost</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through lost and found items. Our community is here to help you reunite with your belongings.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 h-96 w-full rounded-lg overflow-hidden">
          <ItemMapView items={items} />
        </div>

        <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for items (e.g., 'iphone', 'keys')" className="pl-10" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="personal">Personal Items</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <h2 className="text-2xl font-headline font-semibold">No Items Found</h2>
            <p className="mt-2 text-muted-foreground">Check back later or report a new item.</p>
          </div>
        )}
      </section>
    </div>
  );
}

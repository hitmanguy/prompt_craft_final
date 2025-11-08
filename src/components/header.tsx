import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import type { User } from '@/lib/types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PackagePlus } from 'lucide-react';

export async function Header({ user }: { user: User | null }) {
  const navLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link href="/">Browse Items</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/report">Report Item</Link>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-headline text-xl font-bold tracking-tight">ReuniteMe</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">{navLinks}</div>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/report">
              <PackagePlus className="mr-2 h-4 w-4" />
              Report Item
            </Link>
          </Button>
          <UserNav user={user} />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

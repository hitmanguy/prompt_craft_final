import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 animate-in fade-in duration-500">
      <SearchX className="h-24 w-24 text-primary/50" />
      <h1 className="mt-8 text-6xl font-headline font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-headline font-semibold">Page Not Found</h2>
      <p className="mt-2 max-w-sm text-lg text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8" variant="default">
        <Link href="/">Go Back to Homepage</Link>
      </Button>
    </div>
  )
}

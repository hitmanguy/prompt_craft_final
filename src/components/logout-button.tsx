'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/auth';
import { LogOut } from 'lucide-react';
import React from 'react';

export function LogoutButton() {
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      variant="destructive"
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? 'Logging out...' : 'Log Out'}
    </Button>
  );
}

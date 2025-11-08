// @ts-nocheck
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';

const MOCK_USERS = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'password123',
  },
];

export async function getUser(): Promise<User | null> {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = MOCK_USERS.find((u) => u.email === session.email);
    
    if (user) {
        return { id: user.id, name: user.name, email: user.email };
    }

    // Handle users who signed up but are not in the mock list
    if (session.email && session.name) {
      return { id: 'temp-id', name: session.name, email: session.email };
    }

    return null;
  } catch (error) {
    return null;
  }
}

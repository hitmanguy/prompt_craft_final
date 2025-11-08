// @ts-nocheck
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const MOCK_USERS = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'password123',
  },
];

export async function login(data: { email: string; password?: string }) {
  const user = MOCK_USERS.find(
    (u) => u.email === data.email && u.password === data.password
  );
  if (user) {
    cookies().set('session', JSON.stringify({ email: user.email }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
  } else {
    return { error: 'Invalid credentials. Please try again.' };
  }
  redirect('/profile');
}

export async function signup(data: { name: string, email: string; password?: string }) {
    if (MOCK_USERS.find((u) => u.email === data.email)) {
        return { error: 'An account with this email already exists.' };
    }

    // In a real app, you'd save the new user to the database.
    // For this mock, we are not persisting new users.
    
    cookies().set('session', JSON.stringify({ email: data.email, name: data.name }), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
    
    redirect('/profile');
}

export async function logout() {
  cookies().delete('session');
  redirect('/');
}

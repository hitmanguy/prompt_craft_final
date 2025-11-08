'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { categorizeAndTagItem } from '@/ai/flows/item-categorization-and-tagging';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  name: z.string().min(3, 'Item name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string().min(3, 'Location must be at least 3 characters.'),
  }),
  status: z.enum(['lost', 'found']),
  photoDataUri: z.string().url('Invalid image data.'),
});

export async function createItem(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { success: false, message: 'You must be logged in to report an item.' };
  }

  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    location: JSON.parse(formData.get('location') as string),
    status: formData.get('status'),
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { category, tags } = await categorizeAndTagItem({
      photoDataUri: validatedFields.data.photoDataUri,
      description: validatedFields.data.description,
    });

    const newItem = {
      id: crypto.randomUUID(),
      userId: user.id,
      contactInfo: user.email,
      date: new Date().toISOString(),
      ...validatedFields.data,
      category,
      tags,
    };

    // In a real app, you would save `newItem` to a database.
    // For now, we will log it to the console.
    console.log('New Item Created:', newItem);

  } catch (error) {
    console.error('AI Categorization Error:', error);
    return { success: false, message: 'There was an error processing your item. Please try again.' };
  }
  
  revalidatePath('/');
  redirect('/');
}

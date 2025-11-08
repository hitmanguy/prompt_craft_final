'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createItem } from '@/app/actions/items';
import { Card } from '@/components/ui/card';
import { ImageUp, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  name: z.string().min(3, 'Item name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  location: z.string().min(3, 'Please provide a location.'),
  status: z.enum(['lost', 'found'], { required_error: 'You must select a status.' }),
  photo: z.any()
    .refine((files) => files?.length === 1, 'An image is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      '.jpg, .png, and .webp files are accepted.'
    ),
});

const formPlaceholderImage = PlaceHolderImages.find(img => img.id === 'form-placeholder')!;

export function ReportItemForm() {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });
  const fileRef = form.register('photo');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (!preview) {
      toast({ variant: 'destructive', title: 'Error', description: 'No image provided.' });
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('status', values.status);
    formData.append('photoDataUri', preview);

    const result = await createItem(formData);

    if (result?.success === false) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.message,
      });
    }
    // On success, the server action redirects.
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Photo</FormLabel>
              <FormControl>
                <Card className="relative aspect-video w-full flex items-center justify-center bg-muted/50 border-2 border-dashed">
                  {preview ? (
                    <Image src={preview} alt="Item preview" fill className="object-contain rounded-md" />
                  ) : (
                    <>
                    <Image src={formPlaceholderImage.imageUrl} alt="Placeholder" fill className="object-cover rounded-md opacity-20" data-ai-hint={formPlaceholderImage.imageHint} />
                    <div className="text-center text-muted-foreground z-10">
                      <ImageUp className="mx-auto h-12 w-12" />
                      <p className="mt-2">Click or drag to upload an image</p>
                      <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    </>
                  )}
                  <Input {...fileRef} type="file" accept="image/png, image/jpeg, image/webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handlePhotoChange}
                  />
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Is this item lost or found?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <FormItem className="flex-1">
                    <FormControl>
                        <RadioGroupItem value="lost" id="lost" className="peer sr-only" />
                    </FormControl>
                    <FormLabel htmlFor="lost" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Lost
                    </FormLabel>
                  </FormItem>
                   <FormItem className="flex-1">
                    <FormControl>
                        <RadioGroupItem value="found" id="found" className="peer sr-only" />
                    </FormControl>
                    <FormLabel htmlFor="found" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Found
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Black Leather Wallet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide details like color, brand, and any distinguishing features." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Known Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Central Park, near the carousel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </form>
    </Form>
  );
}

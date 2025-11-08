import type { Item } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const keysImage = PlaceHolderImages.find((img) => img.id === 'keys');
const backpackImage = PlaceHolderImages.find((img) => img.id === 'backpack');
const phoneImage = PlaceHolderImages.find((img) => img.id === 'phone');
const walletImage = PlaceHolderImages.find((img) => img.id === 'wallet');

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Set of House Keys',
    description:
      'A bunch of three keys on a silver keyring. One is a car key with a Toyota logo. Has a small blue fob attached.',
    category: 'Personal Items',
    tags: ['keys', 'toyota', 'metal', 'fob'],
    imageUrl: keysImage!.imageUrl,
    imageHint: keysImage!.imageHint,
    location: 'Central Park, near the fountain',
    date: new Date('2024-07-20T14:00:00Z').toISOString(),
    status: 'lost',
    contactInfo: 'jane.doe@example.com',
    userId: '1',
  },
  {
    id: '2',
    name: 'Blue Jansport Backpack',
    description:
      'Found a blue Jansport backpack near the library entrance. Contains a laptop and some textbooks. Seems heavy.',
    category: 'Bags',
    tags: ['backpack', 'jansport', 'blue', 'laptop'],
    imageUrl: backpackImage!.imageUrl,
    imageHint: backpackImage!.imageHint,
    location: 'Main Public Library',
    date: new Date('2024-07-22T10:30:00Z').toISOString(),
    status: 'found',
    contactInfo: 'admin@reuniteme.com',
    userId: '2',
  },
  {
    id: '3',
    name: 'iPhone 14 Pro',
    description:
      'Lost my iPhone 14 Pro, space black color. It has a clear case with a sticker on the back. Last seen at the coffee shop.',
    category: 'Electronics',
    tags: ['iphone', 'apple', 'phone', 'electronics'],
    imageUrl: phoneImage!.imageUrl,
    imageHint: phoneImage!.imageHint,
    location: 'The Daily Grind Coffee',
    date: new Date('2024-07-21T18:45:00Z').toISOString(),
    status: 'lost',
    contactInfo: 'lost.phone.user@email.com',
    userId: '3',
  },
  {
    id: '4',
    name: 'Brown Leather Wallet',
    description:
      'Found a brown leather wallet on the bus, route 5. Contains credit cards and an ID for a "Michael Smith".',
    category: 'Personal Items',
    tags: ['wallet', 'leather', 'cards', 'id'],
    imageUrl: walletImage!.imageUrl,
    imageHint: walletImage!.imageHint,
    location: 'City Bus - Route 5',
    date: new Date('2024-07-23T08:15:00Z').toISOString(),
    status: 'found',
    contactInfo: 'bus.driver@citytransit.com',
    userId: '4',
  },
];

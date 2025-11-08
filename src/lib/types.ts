export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
  location: string;
  date: string; // ISO 8601 format
  status: 'lost' | 'found';
  contactInfo: string;
  userId: string;
}

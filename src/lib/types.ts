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
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  date: string; // ISO 8601 format
  status: 'lost' | 'found';
  contactInfo: string;
  userId: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  itemId: string;
  message: string;
  timestamp: any; // Firestore ServerTimestamp
}

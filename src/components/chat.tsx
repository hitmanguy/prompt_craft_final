'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, where, getDocs, limit } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ChatProps {
  itemId: string;
  senderId: string;
  receiverId: string;
  isOwner: boolean;
}

const getChatId = (itemId: string, userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort();
    return `${itemId}_${sortedIds[0]}_${sortedIds[1]}`;
}

export function Chat({ itemId, senderId, receiverId: initialReceiverId, isOwner }: ChatProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeReceiverId, setActiveReceiverId] = useState<string>(initialReceiverId);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const potentialChatsQuery = useMemoFirebase(() => {
    if (!isOwner) return null;
    return query(collection(firestore, 'items', itemId, 'chats'));
  }, [firestore, itemId, isOwner]);

  const { data: potentialChats, isLoading: isLoadingChats } = useCollection<{
    users: string[], 
    lastMessage?: string,
    lastMessageTimestamp?: any,
  }>(potentialChatsQuery);
  
  useEffect(() => {
      if (isOwner) {
          if(potentialChats && potentialChats.length > 0) {
              const sortedChats = [...potentialChats].sort((a,b) => b.lastMessageTimestamp?.seconds - a.lastMessageTimestamp?.seconds);
              const otherUser = sortedChats[0].users.find(u => u !== senderId);
              if (otherUser) {
                setActiveReceiverId(otherUser);
                setActiveChatId(sortedChats[0].id);
              }
          }
      } else {
          setActiveChatId(getChatId(itemId, senderId, initialReceiverId));
          setActiveReceiverId(initialReceiverId);
      }
  }, [isOwner, potentialChats, senderId, initialReceiverId, itemId]);


  const messagesQuery = useMemoFirebase(() => {
    if (!activeChatId) return null;
    return query(
      collection(firestore, 'items', itemId, 'chats', activeChatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
  }, [firestore, itemId, activeChatId]);

  const { data: messages } = useCollection<ChatMessage>(messagesQuery);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);

  const handleSelectChat = (chatId: string, receiverId: string) => {
    setActiveChatId(chatId);
    setActiveReceiverId(receiverId);
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !activeChatId) return;

    setIsLoading(true);

    const chatRef = collection(firestore, 'items', itemId, 'chats');
    const messagesRef = collection(firestore, 'items', itemId, 'chats', activeChatId, 'messages');

    try {
        await addDoc(messagesRef, {
            senderId: user.id,
            receiverId: activeReceiverId,
            itemId: itemId,
            message: message.trim(),
            timestamp: serverTimestamp(),
        });
        setMessage('');
    } catch (error) {
        console.error('Error sending message: ', error);
    } finally {
        setIsLoading(false);
    }
  };

  const ChatList = () => (
    <div className='w-1/3 border-r'>
        <CardHeader>
            <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <ScrollArea className="h-full">
            {isLoadingChats && <p className="p-4">Loading chats...</p>}
            {potentialChats && potentialChats.map(chat => {
                const otherUserId = chat.users.find(u => u !== senderId);
                if (!otherUserId) return null;
                return (
                    <div key={chat.id} 
                        onClick={() => handleSelectChat(chat.id, otherUserId)}
                        className={cn("p-3 m-2 rounded-lg cursor-pointer hover:bg-muted", activeChatId === chat.id && "bg-muted")}>
                        <p className="font-semibold text-sm truncate">Chat with user</p>
                         <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                )
            })}
            {potentialChats?.length === 0 && !isLoadingChats && <p className="p-4 text-sm text-muted-foreground">No conversations yet.</p>}
        </ScrollArea>
    </div>
  );

  const ChatWindow = () => (
    <div className={cn("flex flex-col", isOwner ? 'w-2/3' : 'w-full')}>
        <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>
                {isOwner ? "Messages with the selected user" : "Messages with the item owner"}
            </CardDescription>
        </CardHeader>
        <ScrollArea className="flex-grow h-64 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
            {messages?.map((msg) => (
                <div
                key={msg.id}
                className={cn(
                    'flex items-end gap-2',
                    msg.senderId === user?.id ? 'justify-end' : 'justify-start'
                )}
                >
                {msg.senderId !== user?.id && (
                    <Avatar className="h-8 w-8">
                    <AvatarFallback>{/* Can add user initials */}</AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    'max-w-xs rounded-lg px-3 py-2 text-sm',
                    msg.senderId === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                >
                    {msg.message}
                </div>
                </div>
            ))}
            {!messages && <div className="text-center text-sm text-muted-foreground py-8">Start the conversation!</div>}
            </div>
        </ScrollArea>
        <CardContent className='pt-4'>
            <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading || !activeChatId}
            />
            <Button type="submit" disabled={isLoading || !message.trim() || !activeChatId}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
            </form>
        </CardContent>
    </div>
  );

  return (
    <Card className="mt-6 w-full">
      <div className="flex">
        {isOwner && <ChatList />}
        <ChatWindow />
      </div>
    </Card>
  );
}

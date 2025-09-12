// Direct 1-on-1 messages
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  createdAt: Date;
  correctedContent?: string; // if peer/AI corrected
}

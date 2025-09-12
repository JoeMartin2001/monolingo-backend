export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  createdAt: Date;
}

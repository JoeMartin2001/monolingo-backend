export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: Date;
}

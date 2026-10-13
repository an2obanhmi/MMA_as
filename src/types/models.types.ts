import { Timestamp, FieldValue } from 'firebase/firestore';

export interface UserProfile {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Timestamp | FieldValue | null;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Timestamp | FieldValue | null;
}

export type TeamMemberRole = 'owner' | 'admin' | 'member';

export interface TeamMember {
  id?: string;
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  joinedAt: Timestamp | FieldValue | null;
  // Denormalized user info for fast display
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: Timestamp | FieldValue | null;
}

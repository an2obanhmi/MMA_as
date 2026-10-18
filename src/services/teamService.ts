import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Team, TeamMember, ChatMessage } from '../types/models.types';

const TEAMS_COLLECTION = 'teams';
const TEAM_MEMBERS_COLLECTION = 'teamMembers';

/**
 * Creates a new team and registers the creator as the 'owner' in teamMembers
 */
export const createTeam = async (
  name: string,
  description: string,
  ownerId: string,
  ownerName: string,
  ownerEmail: string
): Promise<string> => {
  const teamsRef = collection(db, TEAMS_COLLECTION);
  const newTeamDoc = {
    name: name.trim(),
    description: description.trim(),
    ownerId,
    createdAt: serverTimestamp(),
  };

  const teamDocRef = await addDoc(teamsRef, newTeamDoc);
  const teamId = teamDocRef.id;

  // Add owner to teamMembers collection
  const membersRef = collection(db, TEAM_MEMBERS_COLLECTION);
  await addDoc(membersRef, {
    teamId,
    userId: ownerId,
    role: 'owner',
    joinedAt: serverTimestamp(),
    userName: ownerName,
    userEmail: ownerEmail,
  });

  return teamId;
};

/**
 * Joins an existing team by teamId
 */
export const joinTeam = async (
  teamId: string,
  userId: string,
  userName: string,
  userEmail: string
): Promise<void> => {
  const trimmedId = teamId.trim();
  // 1. Verify team exists
  const teamDocRef = doc(db, TEAMS_COLLECTION, trimmedId);
  const teamSnap = await getDoc(teamDocRef);
  if (!teamSnap.exists()) {
    throw new Error('Team does not exist. Please check the Team ID.');
  }

  // 2. Check if already a member
  const membersRef = collection(db, TEAM_MEMBERS_COLLECTION);
  const q = query(
    membersRef,
    where('teamId', '==', trimmedId),
    where('userId', '==', userId)
  );
  const existingSnaps = await getDocs(q);
  if (!existingSnaps.empty) {
    throw new Error('You are already a member of this team.');
  }

  // 3. Register as member
  await addDoc(membersRef, {
    teamId: trimmedId,
    userId,
    role: 'member',
    joinedAt: serverTimestamp(),
    userName,
    userEmail,
  });
};

/**
 * Real-time listener for teams that the user is currently a member of
 */
export const getUserTeamsRealtime = (
  userId: string,
  onSuccess: (teams: Team[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const membersRef = collection(db, TEAM_MEMBERS_COLLECTION);
  const q = query(membersRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    async (snapshot) => {
      try {
        const teamIds = snapshot.docs.map((d) => d.data().teamId as string);
        if (teamIds.length === 0) {
          onSuccess([]);
          return;
        }

        // Fetch each team doc
        const teamPromises = teamIds.map(async (id) => {
          const tSnap = await getDoc(doc(db, TEAMS_COLLECTION, id));
          if (tSnap.exists()) {
            return {
              id: tSnap.id,
              ...tSnap.data(),
            } as Team;
          }
          return null;
        });

        const results = await Promise.all(teamPromises);
        const validTeams = results.filter((t): t is Team => t !== null);
        onSuccess(validTeams);
      } catch (err: unknown) {
        if (onError && err instanceof Error) onError(err);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for all members of a specific team
 */
export const getTeamMembersRealtime = (
  teamId: string,
  onSuccess: (members: TeamMember[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const membersRef = collection(db, TEAM_MEMBERS_COLLECTION);
  const q = query(membersRef, where('teamId', '==', teamId));

  return onSnapshot(
    q,
    (snapshot) => {
      const members: TeamMember[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as TeamMember));
      onSuccess(members);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for team chat messages: teams/{teamId}/messages
 */
export const getTeamMessagesRealtime = (
  teamId: string,
  onSuccess: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const messagesRef = collection(db, TEAMS_COLLECTION, teamId, 'messages');
  // Limit to 60 most recent messages to protect bandwidth and avoid read fee explosion
  const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(60));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: ChatMessage[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as ChatMessage));
      onSuccess(messages);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
};

/**
 * Sends a chat message to teams/{teamId}/messages with length validation
 */
export const sendChatMessage = async (
  teamId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<void> => {
  const sanitizedText = text.trim();
  if (!sanitizedText) return;
  if (sanitizedText.length > 1000) {
    throw new Error('Nội dung tin nhắn không được vượt quá 1000 ký tự.');
  }

  const messagesRef = collection(db, TEAMS_COLLECTION, teamId, 'messages');
  await addDoc(messagesRef, {
    senderId,
    senderName,
    text: sanitizedText,
    createdAt: serverTimestamp(),
  });
};

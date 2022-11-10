import type { UR, LiteralStringForUnion } from 'stream-chat';

export type UserRole = 'streamer' | 'moderator' | 'VIP' | 'user' | string;

export type AttachmentType = UR;
export type ChannelType = UR;
export type CommandType = LiteralStringForUnion;
export type EventType = UR;
export type MessageType = UR;
export type ReactionType = UR;
export type UserType = { color: string; userRole: UserRole };

export type StreamChatType = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
};
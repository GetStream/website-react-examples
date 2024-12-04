import type { LiteralStringForUnion, UR } from 'stream-chat';

export type AttachmentType = {};
export type ChannelType = { demo?: string };
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MemberType = UR;
export type MessageType = {};
export type ReactionType = {};
export type UserType = { image?: string };

export type StreamChatGenerics = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  memberType: MemberType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
  pollOptionType: Record<string, unknown>;
  pollType: Record<string, unknown>;
};

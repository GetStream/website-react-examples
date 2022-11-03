import { PropsWithChildren } from 'react';
import { LiteralStringForUnion, UR } from 'stream-chat';

export type PropsWithChildrenOnly = PropsWithChildren<Record<never, never>>;
type AttachmentType = UR;
type ChannelType = UR;
type CommandType = LiteralStringForUnion;
type EventType = UR;
type MessageType = UR & { up_votes?: string[]; show_in_channel?: boolean };
type ReactionType = UR;
export type UserType = UR & { image?: string; title?: string };

export type StreamChatType = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
};

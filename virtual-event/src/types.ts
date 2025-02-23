import { PropsWithChildren } from 'react';
import { LiteralStringForUnion, UR } from 'stream-chat';

export type PropsWithChildrenOnly = PropsWithChildren<Record<never, never>>;
type AttachmentType = UR;
type ChannelType = UR;
type CommandType = LiteralStringForUnion;
type EventType = UR;
type MemberType = UR;
type MessageType = UR & { up_votes?: string[]; show_in_channel?: boolean };
type ReactionType = UR;
export type UserType = UR & { image?: string; title?: string };
export type PollOptionType = UR;
export type PollType = UR;

export type StreamChatType = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  memberType: MemberType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
  pollOptionType: PollOptionType;
  pollType: PollType;
};

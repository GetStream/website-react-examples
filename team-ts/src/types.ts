import type { UR, LiteralStringForUnion } from 'stream-chat';

export type TeamAttachmentType = UR;
export type TeamChannelType = UR;
export type TeamCommandType = LiteralStringForUnion;
export type TeamEventType = UR;
export type TeamMemberType = UR;
export type TeamMessageType = UR;
export type TeamReactionType = UR;
export type TeamUserType = { image?: string };
export type TeamPollOptionType = UR;
export type TeamPollType = UR;

export type StreamChatType = {
  attachmentType: TeamAttachmentType;
  channelType: TeamChannelType;
  commandType: TeamCommandType;
  eventType: TeamEventType;
  memberType: TeamMemberType;
  messageType: TeamMessageType;
  reactionType: TeamReactionType;
  userType: TeamUserType;
  pollOptionType: TeamPollOptionType;
  pollType: TeamPollType;
};

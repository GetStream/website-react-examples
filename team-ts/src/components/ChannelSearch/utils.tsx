import type { Channel, ChannelFilters, UserResponse, StreamChat } from 'stream-chat';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

export type ChannelOrUserType =
  | Channel<
      TeamAttachmentType,
      TeamChannelType,
      TeamCommandType,
      TeamEventType,
      TeamMessageType,
      TeamReactionType,
      TeamUserType
    >
  | UserResponse<TeamUserType>;

export const isChannel = (
  channel: ChannelOrUserType,
): channel is Channel<
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType
> =>
  (channel as Channel<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >).cid !== undefined;

type Props = {
  client: StreamChat<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >;
  setActiveChannel: (
    newChannel?: Channel<
      TeamAttachmentType,
      TeamChannelType,
      TeamCommandType,
      TeamEventType,
      TeamMessageType,
      TeamReactionType,
      TeamUserType
    >,
    watchers?: {
      limit?: number;
      offset?: number;
    },
    event?: React.SyntheticEvent,
  ) => void;
  user: UserResponse<TeamUserType>;
};

export const channelByUser = async (props: Props) => {
  const { client, setActiveChannel, user } = props;

  const filters: ChannelFilters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [user.id as string, client.userID || ''] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) {
    return setActiveChannel(existingChannel);
  }

  const newChannel = client.channel('messaging', {
    members: [user.id as string, client.userID || ''],
  });
  return setActiveChannel(newChannel);
};

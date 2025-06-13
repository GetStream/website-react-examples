import type { Channel, ChannelFilters, StreamChat, UserResponse } from 'stream-chat';



export type ChannelOrUserType =
  | Channel
  | UserResponse;

export const isChannel = (
  channel: ChannelOrUserType,
): channel is Channel =>
  (channel as Channel).cid !== undefined;

type Props = {
  client: StreamChat;
  setActiveChannel: (
    newChannel?: Channel,
    watchers?: {
      limit?: number;
      offset?: number;
    },
    event?: React.SyntheticEvent,
  ) => void;
  user: UserResponse;
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

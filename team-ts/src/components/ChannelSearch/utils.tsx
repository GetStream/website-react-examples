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
  openChannel: (channel: Channel) => void;
  user: UserResponse;
};

export const channelByUser = async (props: Props) => {
  const { client, openChannel, user } = props;

  const filters: ChannelFilters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [user.id as string, client.userID || ''] },
  };

  const [existingChannel] = await client.queryChannelsAndHydrate({ filter_conditions: filters });

  if (existingChannel) {
    return openChannel(existingChannel);
  }

  // <Channel> no longer watches; watch() resolves with the surviving instance for the new cid
  const newChannel = await client
    .channel('messaging', {
      members: [user.id as string, client.userID || ''].map((user_id) => ({ user_id })),
    })
    .watch();
  return openChannel(newChannel);
};

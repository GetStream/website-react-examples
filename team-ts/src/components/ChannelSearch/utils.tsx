import type { Channel, ChannelFilters, StreamChat, UserResponse } from 'stream-chat';
import type { WorkspaceNavigation } from 'stream-chat-react';



export type ChannelOrUserType =
  | Channel
  | UserResponse;

export const isChannel = (
  channel: ChannelOrUserType,
): channel is Channel =>
  (channel as Channel).cid !== undefined;

type Props = {
  client: StreamChat;
  openChannel: WorkspaceNavigation['openChannel'];
  user: UserResponse;
};

export const channelByUser = async (props: Props) => {
  const { client, openChannel, user } = props;

  const filters: ChannelFilters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [user.id as string, client.userID || ''] },
  };

  const [existingChannel] = await client.queryChannelsAndHydrate(
    { filter_conditions: filters },
    // without stateOptions the call resolves to the `withResponse: true` overload's type
    { withResponse: false },
  );

  if (existingChannel) {
    return openChannel(existingChannel);
  }

  // v15's Channel no longer watches. For a members-only channel, use the instance ensureWatched()
  // resolves with: the one you created can be superseded once the server assigns the id.
  const newChannel = await client
    .channel('messaging', {
      members: [{ user_id: user.id as string }, { user_id: client.userID || '' }],
    })
    .ensureWatched();
  return openChannel(newChannel);
};

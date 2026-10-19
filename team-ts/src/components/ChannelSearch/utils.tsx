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

  // stream-chat-react 15's Channel no longer watches the channel it is given
  const newChannel = await client.channelManager
    .ensure({
      data: { members: [{ user_id: user.id }, { user_id: client.userID || '' }] },
      type: 'messaging',
    })
    .ensureWatched();
  return openChannel(newChannel);
};

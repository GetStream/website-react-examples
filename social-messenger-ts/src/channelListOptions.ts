import type { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';

/**
 * Exports few channel list configuration options. See the docs for more information:
 * - https://getstream.io/chat/docs/sdk/react/core-components/channel_list/
 *
 * @param disableChannelNameFilter set it to true if you want to see all channels where the given user is a member.
 * @param user the user id.
 */
export const getChannelListOptions = (
  disableChannelNameFilter: boolean,
  user: string | undefined,
) => {
  const filters: ChannelFilters = disableChannelNameFilter
    ? { type: 'messaging', members: { $in: [user!] } }
    : { type: 'messaging', name: 'Social Demo', demo: 'social' };

  const options: ChannelOptions = { state: true, watch: true, presence: true, limit: 8 };

  const sort: ChannelSort = {
    last_message_at: -1,
    updated_at: -1,
  };

  return {
    filters,
    options,
    sort,
  };
};

import type { ChannelFilters, ChannelPaginatorRequestOptions, SortParamRequest } from 'stream-chat';

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
    : { type: 'messaging', name: 'Social Demo', 'custom.demo': 'social' };

  const requestOptions: ChannelPaginatorRequestOptions = { state: true, watch: true, presence: true };
  const pageSize = 8;

  const sort: SortParamRequest[] = [
    { field: 'last_message_at', direction: -1 },
    { field: 'updated_at', direction: -1 },
  ];

  return {
    filters,
    pageSize,
    requestOptions,
    sort,
  };
};

export type ChannelListOptions = ReturnType<typeof getChannelListOptions>;

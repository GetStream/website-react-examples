import { type MouseEventHandler, useEffect, useMemo, useRef } from 'react';
import { ChannelPaginator, type ChannelPaginatorState } from 'stream-chat';
import {
  ChannelList,
  type ChannelListItemUIProps,
  useChatContext,
  useStateStore,
  useWorkspaceNavigation,
  WithComponents,
} from 'stream-chat-react';

import { MessagingChannelListHeader, MessagingChannelPreview } from '../index';
import { useThemeContext } from '../../context';
import type { ChannelListOptions } from '../../channelListOptions';

type MessagingSidebarProps = {
  channelListOptions: ChannelListOptions;
  onClick: MouseEventHandler;
  onCreateChannel: () => void;
  onPreviewSelect: MouseEventHandler;
};

const firstChannelSelector = ({ items }: ChannelPaginatorState) => ({ firstChannel: items?.[0] });

/** stream-chat-react 14's ChannelList opened the first channel on mount; v15 leaves that to the app. */
const useOpenFirstChannel = (paginator: ChannelPaginator) => {
  const { openChannel, openChannels } = useWorkspaceNavigation();
  const { firstChannel } = useStateStore(paginator.state, firstChannelSelector);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current || !firstChannel) return;
    opened.current = true;
    if (!openChannels.length) openChannel(firstChannel);
  }, [firstChannel, openChannel, openChannels.length]);
};

const MessagingSidebar = ({
  channelListOptions,
  onClick,
  onCreateChannel,
  onPreviewSelect,
}: MessagingSidebarProps) => {
  const { client } = useChatContext();
  const { themeClassName } = useThemeContext();

  const paginator = useMemo(() => {
    const { filters, pageSize, requestOptions, sort } = channelListOptions;
    return new ChannelPaginator({
      client,
      filters,
      id: 'social-messenger',
      paginatorOptions: { pageSize },
      requestOptions,
      sort,
    });
  }, [channelListOptions, client]);

  useEffect(() => {
    client.channelManager.insertPaginator({ paginator });
    return () => {
      client.channelManager.removePaginator(paginator);
    };
  }, [client, paginator]);

  useOpenFirstChannel(paginator);

  const overrides = useMemo(
    () => ({
      ChannelListItemUI: (props: ChannelListItemUIProps) => (
        <MessagingChannelPreview {...props} onClick={onPreviewSelect} />
      ),
    }),
    [onPreviewSelect],
  );

  return (
    <div
      className={`str-chat messaging__sidebar ${themeClassName}`}
      id='mobile-channel-list'
      onClick={onClick}
    >
      <MessagingChannelListHeader onCreateChannel={onCreateChannel} />
      <WithComponents overrides={overrides}>
        <div className='str-chat__channel-list'>
          <ChannelList paginator={paginator} />
        </div>
      </WithComponents>
    </div>
  );
};

export default MessagingSidebar;

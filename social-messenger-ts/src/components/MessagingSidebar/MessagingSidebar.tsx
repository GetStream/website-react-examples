import { type MouseEventHandler, useMemo } from 'react';
import {
  ChannelList,
  type ChannelListItemUIProps,
  type ChannelListProps,
  WithComponents,
} from 'stream-chat-react';

import { MessagingChannelListHeader, MessagingChannelPreview } from '../index';
import { useThemeContext } from '../../context';

type MessagingSidebarProps = {
  channelListOptions: {
    filters: ChannelListProps['filters'];
    sort: ChannelListProps['sort'];
    options: ChannelListProps['options'];
  };
  onClick: MouseEventHandler;
  onCreateChannel: () => void;
  onPreviewSelect: MouseEventHandler;
};

const NoChannelListHeader = () => null;

const MessagingSidebar = ({
  channelListOptions,
  onClick,
  onCreateChannel,
  onPreviewSelect,
}: MessagingSidebarProps) => {
  const { themeClassName } = useThemeContext();
  const overrides = useMemo(
    () => ({
      // The sidebar has its own header, so hide the "Chats" header stream-chat-react 14 adds
      ChannelListHeader: NoChannelListHeader,
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
        <ChannelList {...channelListOptions} />
      </WithComponents>
    </div>
  );
};

export default MessagingSidebar;

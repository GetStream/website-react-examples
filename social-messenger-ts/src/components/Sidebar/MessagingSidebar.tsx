import { ChannelList, ChannelListProps } from 'stream-chat-react';
import { MessagingChannelList, MessagingChannelListHeader, MessagingChannelPreview } from '../index';
import type { Theme } from '../../hooks/useTheme';

import type { MouseEventHandler } from 'react';


type MessagingSidebarProps = {
  channelListOptions: {
    filters: ChannelListProps['filters']
    sort: ChannelListProps['sort']
    options: ChannelListProps['options']
  }
  onClick: MouseEventHandler;
  onCreateChannel: () => void;
  onPreviewSelect: MouseEventHandler;
  theme: Theme;
}

export const MessagingSidebar = ({channelListOptions, onClick, onCreateChannel, onPreviewSelect, theme}: MessagingSidebarProps) => {

  return (
    <div className={`str-chat messaging__sidebar ${theme}`} id='mobile-channel-list' onClick={onClick}>
      <MessagingChannelListHeader
        onCreateChannel={onCreateChannel}
      />
      <ChannelList
        {...channelListOptions}
        List={MessagingChannelList}
        Preview={(props) => <MessagingChannelPreview {...props} onClick={onPreviewSelect} />}
      />
    </div>
  )
}
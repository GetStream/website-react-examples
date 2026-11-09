import { type MouseEventHandler, useEffect, useMemo, useRef } from 'react';
import type { ChannelPaginator } from 'stream-chat';
import {
  ChannelList,
  type ChannelListItemUIProps,
  useWorkspaceNavigation,
  WithComponents,
} from 'stream-chat-react';

import { MessagingChannelListHeader, MessagingChannelPreview } from '../index';
import { useThemeContext } from '../../context';

type MessagingSidebarProps = {
  paginator: ChannelPaginator;
  onClick: MouseEventHandler;
  onCreateChannel: () => void;
  onPreviewSelect: MouseEventHandler;
};

// v14's ChannelList opened the first channel on mount (setActiveChannelOnMount); v15 opens nothing.
// The sidebar remounts on every switch back to the channels view, so open only when nothing is open.
const useOpenFirstChannel = (paginator: ChannelPaginator) => {
  const { openChannel, openChannels } = useWorkspaceNavigation();
  const hasOpenChannel = useRef(openChannels.length > 0);
  hasOpenChannel.current = openChannels.length > 0;
  useEffect(
    () =>
      paginator.state.subscribeWithSelector(
        ({ items }) => ({ first: items?.[0] }),
        ({ first }) => {
          if (first && !hasOpenChannel.current) openChannel(first);
        },
      ),
    [paginator, openChannel],
  );
};

const MessagingSidebar = ({
  paginator,
  onClick,
  onCreateChannel,
  onPreviewSelect,
}: MessagingSidebarProps) => {
  const { themeClassName } = useThemeContext();

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
        <ChannelList paginator={paginator} />
      </WithComponents>
    </div>
  );
};

export default MessagingSidebar;

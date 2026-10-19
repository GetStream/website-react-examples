import clsx from 'clsx';
import { type MouseEvent, useCallback } from 'react';
import { ChannelListItemUIProps, useWorkspaceNavigation } from 'stream-chat-react';

import { DirectMessagingChannelPreview } from './DirectMessagingChannelPreview';
import { TeamChannelPreview } from './TeamChannelPreview';

type TeamChannelPreviewProps = ChannelListItemUIProps & {
  type: string;
};

export const ChannelPreview = ({ active, channel, type }: TeamChannelPreviewProps) => {
  // opening a channel also switches the workspace back to 'Chat' (see WorkspaceController)
  const { openChannel } = useWorkspaceNavigation();

  const handleClick = useCallback(
    (event: MouseEvent) => openChannel(channel, { event }),
    [channel, openChannel],
  );

  return (
    <button
      className={clsx('channel-preview', {selected: active})}
      onClick={handleClick}
    >
      {type === 'team'
        ? <TeamChannelPreview name={channel?.data?.custom?.name || channel?.data?.id as string || 'random'}/>
        : <DirectMessagingChannelPreview channel={channel}/>
      }
    </button>
  );
};

import clsx from 'clsx';
import { useCallback } from 'react';
import { ChannelListItemUIProps, useWorkspaceNavigation } from 'stream-chat-react';

import { DirectMessagingChannelPreview } from './DirectMessagingChannelPreview';
import { TeamChannelPreview } from './TeamChannelPreview';

import { useWorkspaceController } from '../../context/WorkspaceController';

type TeamChannelPreviewProps = ChannelListItemUIProps & {
  type: string;
};

export const ChannelPreview = ({ active, channel, type }: TeamChannelPreviewProps) => {
  const { openChannel } = useWorkspaceNavigation();
  const { displayWorkspace } = useWorkspaceController();

  const handleClick = useCallback((event: React.MouseEvent) => {
    displayWorkspace('Chat');
    openChannel(channel, { event });
  }, [channel, displayWorkspace, openChannel])

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

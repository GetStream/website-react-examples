import { ChannelPlaceholder, useWorkspaceNavigation, WithComponents } from 'stream-chat-react';

import { AdminPanel } from '../AdminPanel/AdminPanel';
import { ChannelInner } from './ChannelInner';
import { EmptyChannel } from '../EmptyChannel/EmptyChannel';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';
import {TeamTypingIndicator} from '../TeamTypingIndicator/TeamTypingIndicator';
import { TeamMessage } from '../TeamMessage/TeamMessage';

import { useWorkspaceController } from '../../context/WorkspaceController';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

const LoadingIndicator = () => null;

init({data})

export const ChannelContainer = () => {
  const { activeWorkspace } = useWorkspaceController();
  const { openChannels, openThreads } = useWorkspaceNavigation();
  const [channel] = openChannels;
  const [thread] = openThreads;

  if (activeWorkspace.match('Admin')) {
    return <AdminPanel/>;
  }

  return (
    <div className='channel__container'>
      <WithComponents
        overrides={{
          EmptyStateIndicator: EmptyChannel,
          LoadingIndicator,
          MessageComposerUI: TeamMessageInput,
          MessageUI: TeamMessage,
          TypingIndicator: TeamTypingIndicator,
          emojiSearchIndex: SearchIndex,
        }}
      >
        {channel ? (
          <ChannelInner channel={channel} thread={thread} />
        ) : (
          <ChannelPlaceholder>
            <EmptyChannel />
          </ChannelPlaceholder>
        )}
      </WithComponents>
    </div>
  );
};

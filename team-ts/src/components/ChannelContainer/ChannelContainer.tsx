import { Channel, WithComponents } from 'stream-chat-react';

import { AdminPanel } from '../AdminPanel/AdminPanel';
import { ChannelInner } from './ChannelInner';
import { EmptyChannel } from '../EmptyChannel/EmptyChannel';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';
import {TeamTypingIndicator} from '../TeamTypingIndicator/TeamTypingIndicator';
import { ThreadHeader } from '../TeamChannelHeader/ThreadHeader';
import { TeamMessage } from '../TeamMessage/TeamMessage';

import { useWorkspaceController } from '../../context/WorkspaceController';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

const LoadingIndicator = () => null;

init({data})

export const ChannelContainer = () => {
  const { activeWorkspace } = useWorkspaceController();

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
          Message: TeamMessage,
          ThreadHeader,
          TypingIndicator: TeamTypingIndicator,
          emojiSearchIndex: SearchIndex,
        }}
      >
        <Channel>
          <ChannelInner />
        </Channel>
      </WithComponents>
    </div>
  );
};

import { Channel, ChannelPlaceholder, WithComponents } from 'stream-chat-react';

import { AdminPanel } from '../AdminPanel/AdminPanel';
import { ChannelInner, ThreadInner } from './ChannelInner';
import { EmptyChannel } from '../EmptyChannel/EmptyChannel';
import { PinnedMessageList } from '../PinnedMessageList/PinnedMessageList';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';
import {TeamTypingIndicator} from '../TeamTypingIndicator/TeamTypingIndicator';
import { TeamMessage } from '../TeamMessage/TeamMessage';

import { useWorkspaceController } from '../../context/WorkspaceController';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

const LoadingIndicator = () => null;

init({data})

export const ChannelContainer = () => {
  const { activeChannel, activeThread, activeWorkspace } = useWorkspaceController();

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
        {activeChannel ? (
          <Channel channel={activeChannel}>
            <ChannelInner />
          </Channel>
        ) : (
          <ChannelPlaceholder />
        )}
        {/* v15 <Channel> no longer lays out the thread beside itself; .channel__container is the row */}
        {activeThread && <ThreadInner thread={activeThread} />}
        {activeChannel && <PinnedMessageList channel={activeChannel} />}
      </WithComponents>
    </div>
  );
};

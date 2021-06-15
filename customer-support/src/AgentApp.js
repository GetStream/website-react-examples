import React from 'react';
import { Channel, MessageCommerce, MessageInput, MessageList, Window } from 'stream-chat-react';

import { AgentChannelListContainer } from './components/AgentChannelListContainer/AgentChannelListContainer';
import { AgentChannelHeader } from './components/AgentChannelHeader/AgentChannelHeader';
import { AgentMessageInput } from './components/MessageInput/AgentMessageInput';

export const AgentApp = ({ agentChannelId, customerChannelId }) => (
  <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
    <AgentChannelListContainer {...{ agentChannelId, customerChannelId }} />
    <div className='agent-channel-wrapper'>
      <Channel Input={AgentMessageInput} Message={MessageCommerce}>
        <Window>
          <AgentChannelHeader />
          <MessageList />
          <MessageInput focus />
        </Window>
      </Channel>
    </div>
  </div>
);

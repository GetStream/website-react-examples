import React, { useEffect, useState } from 'react';
import { Chat } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { v4 as uuidv4 } from 'uuid';

import 'stream-chat-react/dist/css/index.css';

import './App.css';

import { AgentApp } from './AgentApp';
import JenAvatar from './assets/jen-avatar.png';
import KevinAvatar from './assets/kevin-avatar.png';
import User1 from './assets/user1.png';
import { AgentHeader } from './components/AgentHeader/AgentHeader';
import { AgentLoading } from './components/AgentLoading/AgentLoading';
import { useChecklist } from './ChecklistTasks';
import { CustomerApp } from './CustomerApp';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const agentChannelId = `agent-demo-${uuidv4()}`;
const customerChannelId = `customer-demo-${uuidv4()}`;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;
const theme = 'light';

const previousUserId = urlParams.get('user1') || process.env.REACT_APP_PREVIOUS_ID;
const previousUserToken = urlParams.get('user1_token') || process.env.REACT_APP_PREVIOUS_TOKEN;

const agentUserId = urlParams.get('user2') || process.env.REACT_APP_AGENT_ID;
const agentUserToken = urlParams.get('user2_token') || process.env.REACT_APP_AGENT_TOKEN;

const customerUserId = urlParams.get('user3') || process.env.REACT_APP_CUSTOMER_ID;
const customerUserToken = urlParams.get('user3_token') || process.env.REACT_APP_CUSTOMER_TOKEN;

const customerClient = StreamChat.getInstance(apiKey);
customerClient.connectUser(
  {
    id: customerUserId,
    name: 'Kevin Rosen',
    image: KevinAvatar,
    phone: '+1 (303) 555-1212',
    email: 'kevin@example.com',
  },
  customerUserToken,
);

const App = () => {
  const [agentClient, setAgentClient] = useState();
  const [initialClient, setInitialClient] = useState();
  const [initialChannel, setInitialChannel] = useState();

  /**
   * Creates and watches a channel with a mock customer as the user
   */
  useEffect(() => {
    const getInitialChannel = async () => {
      const client = new StreamChat(apiKey); // since app is dual client need to construct an additional instance
      await client.connectUser(
        {
          id: previousUserId,
          name: 'Jen Alexander',
          image: JenAvatar,
          phone: '+1 (720) 555-1525',
          email: 'jen@example.com',
          role: 'moderator',
        },
        previousUserToken,
      );
      setInitialClient(client);

      const newChannel = await client.channel('commerce', agentChannelId, {
        image: JenAvatar,
        name: 'Jen Alexander',
        issue: 'Enterprise Inquiry',
        subtitle: '#572 Enterprise Inquiry',
      });

      if (newChannel.state.messages.length) {
        newChannel.state.clearMessages();
      }

      await newChannel.watch();

      setInitialChannel(newChannel);
    };

    getInitialChannel();

    return () => {
      customerClient.disconnectUser();
      agentClient.disconnectUser();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Sends messages to mock channel, disconnects mock channel, and sets
   * support agent as current user
   */
  useEffect(() => {
    const sendMessages = async () => {
      await initialChannel.sendMessage({
        text: 'I have a question about Enterprise',
      });

      await initialChannel.sendMessage({
        text:
          'My company is looking to upgrade our account to Enterprise. Can you provide me with some additional pricing information?',
      });

      await initialChannel.stopWatching();
      await initialClient.disconnectUser();

      const client = new StreamChat(apiKey); // since app is dual client need to construct an additional instance
      await client.connectUser(
        { id: agentUserId, name: 'Daniel Smith', image: User1 },
        agentUserToken,
      );

      const [existingChannel] = await client.queryChannels({
        id: agentChannelId,
      });

      await existingChannel.watch();

      setAgentClient(client);
    };

    if (initialChannel && !initialChannel.state.messages.length) {
      sendMessages();
    }
  }, [initialChannel]); // eslint-disable-line react-hooks/exhaustive-deps

  useChecklist(customerClient, targetOrigin);

  return (
    <>
      <div className='agent-wrapper'>
        <AgentHeader />
        {agentClient ? (
          <Chat client={agentClient}>
            <AgentApp {...{ agentChannelId, customerChannelId }} />
          </Chat>
        ) : (
          <AgentLoading />
        )}
      </div>
      {customerClient && (
        <Chat client={customerClient} theme={`commerce ${theme}`}>
          <CustomerApp {...{ customerChannelId }} />
        </Chat>
      )}
    </>
  );
};

export default App;

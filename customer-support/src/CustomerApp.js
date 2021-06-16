import React, { useEffect, useState } from 'react';
import {
  Channel,
  MessageCommerce,
  MessageInput,
  MessageList,
  useChatContext,
  Window,
} from 'stream-chat-react';

import KevinAvatar from './assets/kevin-avatar.png';
import { EmptyStateIndicator } from './components/CustomerEmptyStateIndicator/EmptyStateIndicator';
import { CustomerChannelHeader } from './components/CustomerChannelHeader/CustomerChannelHeader';
import { CustomerMessageInput } from './components/MessageInput/CustomerMessageInput';

import { CloseCustomerIcon, OpenCustomerIcon } from './assets';

export const CustomerApp = ({ customerChannelId }) => {
  const { client: customerClient } = useChatContext();

  const [customerChannel, setCustomerChannel] = useState();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const getCustomerChannel = async () => {
      const newChannel = await customerClient.channel('commerce', customerChannelId, {
        name: 'Kevin Rosen',
        image: KevinAvatar,
        issue: 'Company Inquiry',
        subtitle: '#853 Company Inquiry',
      });

      if (newChannel.state.messages.length) {
        newChannel.state.clearMessages();
      }

      await newChannel.watch();

      setCustomerChannel(newChannel);
    };

    getCustomerChannel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`customer-wrapper ${open ? 'wrapper--open' : ''}`}>
      {customerChannel && open && (
        <Channel
          channel={customerChannel}
          EmptyStateIndicator={(props) => (
            <EmptyStateIndicator {...props} channel={customerChannel} />
          )}
          Input={(props) => <CustomerMessageInput {...props} {...{ open, setOpen }} />}
          Message={MessageCommerce}
        >
          <Window>
            <CustomerChannelHeader />
            {open && (
              <div style={{ background: '#005fff' }}>
                <MessageList />
              </div>
            )}
            <MessageInput focus />
          </Window>
        </Channel>
      )}
      <div className={`toggle-button ${open && 'close-button'}`} onClick={() => setOpen(!open)}>
        {open ? <CloseCustomerIcon /> : <OpenCustomerIcon />}
      </div>
    </div>
  );
};

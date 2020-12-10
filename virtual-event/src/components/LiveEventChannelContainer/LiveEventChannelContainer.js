import React, { useState } from 'react';
import { MessageList } from 'stream-chat-react';
import { LiveEventAttendees } from '../LiveEventAttendees/LiveEventAttendees';
import { LiveEventChannelFooter } from '../LiveEventChannelFooter/LiveEventChannelFooter';
import { LiveEventMessage } from '../LiveEventMessage/LiveEventMessage';

import './LiveEventChannelContainer.css';

export const LiveEventChannelContainer = ({ tab }) => {
  const [pinnedMessages, setPinnedMessages] = useState({});

  const pinnedMessagesArray = Object.values(pinnedMessages);
  const pinnedMessagesIds = Object.keys(pinnedMessages);

  const selectedComponent = () => {
    switch (tab) {
      case 1:
        return (
          <div>
            <MessageList
              noGroupByUser
              Message={(props) => (
                <LiveEventMessage
                  {...props}
                  pinnedMessages={pinnedMessages}
                  pinnedMessagesIds={pinnedMessagesIds}
                  setPinnedMessages={setPinnedMessages}
                />
              )}
            />
            <LiveEventChannelFooter />
          </div>
        );
      case 2:
        return (
          <div className={'pinned-messages__container'}>
            <MessageList
              noGroupByUser
              messages={pinnedMessagesArray}
              Message={(props) => (
                <LiveEventMessage
                  {...props}
                  setPinnedMessages={setPinnedMessages}
                  pinnedMessages={pinnedMessages}
                />
              )}
            />
          </div>
        );
      case 3:
        return <LiveEventAttendees />;
      default:
        return <LiveEventAttendees />;
    }
  };

  return <div>{selectedComponent()}</div>;
};

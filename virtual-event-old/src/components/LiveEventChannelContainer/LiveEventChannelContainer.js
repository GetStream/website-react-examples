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
          <>
            <MessageList
              noGroupByUser
              Message={() => (
                <LiveEventMessage
                  pinnedMessages={pinnedMessages}
                  pinnedMessagesIds={pinnedMessagesIds}
                  setPinnedMessages={setPinnedMessages}
                />
              )}
            />
            <LiveEventChannelFooter />
          </>
        );
      case 2:
        return (
          <div className={'pinned-messages__container'}>
            <MessageList
              loadingMore={false}
              noGroupByUser
              messages={pinnedMessagesArray}
              Message={() => (
                <LiveEventMessage
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

  return <>{selectedComponent()}</>;
};

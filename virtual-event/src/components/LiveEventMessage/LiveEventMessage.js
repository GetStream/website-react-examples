import React, { useContext, useState } from 'react';

import { MessageLivestream, MessageActions, ChatContext } from 'stream-chat-react';
import { OnlineIndicator } from '../../assets/OnlineIndicator';
import { PinIcon } from '../../assets/PinIcon';
import { PinIconDark } from '../../assets/PinIconDark';
import { LiveEventReactions } from '../LiveEventReactions/LiveEventReactions';

import './LiveEventMessage.css';

export const LiveEventMessage = (props) => {
  const { message, pinnedMessagesIds, setPinnedMessages } = props;
  const isMessagePinned = pinnedMessagesIds?.find((id) => id === message.id);
  const [isPinned, setIsPinned] = useState(isMessagePinned);

  const { theme } = useContext(ChatContext);

  const onlineStatus = props.message.user.online;

  const pinChecker = () => {
    if (!isPinned) {
      setIsPinned(true);
      setPinnedMessages((prevMessages) => ({
        ...prevMessages,
        [message.id]: message,
      }));
    } else {
      setIsPinned(false);
      setPinnedMessages((prevMessages) => {
        const copy = { ...prevMessages };
        delete copy[message.id];
        return copy;
      });
    }
  };

  const getMessageActions = () => ['edit', 'delete', 'react', 'reply', 'mute'];

  return (
    <div className={isPinned ? 'live-event-message__container__pinned' : 'live-event-message__container__unpinned'}>
      <div className='pin-icon' style={{ marginLeft: '15px' }} onClick={pinChecker}>
        {isPinned ? theme === 'livestream light' ? <PinIcon /> : <PinIconDark /> : null}
      </div>
      <div style={{ position: 'relative' }}>
        {onlineStatus && (
          <div className='online-indicator'>
            <OnlineIndicator />
          </div>
        )}
        <div className='new-actions'>
          <MessageActions {...props} handleMute={pinChecker} getMessageActions={getMessageActions} />
        </div>
        <MessageLivestream {...props} ReactionsList={LiveEventReactions} />
      </div>
    </div>
  );
};

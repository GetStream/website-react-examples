import React, { useCallback } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { CloseChatButton, OnlineUsersIcon } from '../../assets';
import { useEventContext } from '../../contexts/EventContext';

type HeaderTabItemProps = {
  animate: boolean;
  content: React.ReactNode;
  onClick: () => void;
  className?: string;
};

const HeaderTabItem = ({ animate, className, onClick, content }: HeaderTabItemProps) => {
  const variants: Variants = {
    open: { opacity: 1, y: 0, zIndex: 1 },
    closed: { opacity: 0, y: -4, zIndex: -1 },
  };

  return (
    <div className='chat-components-header-tabs-item' onClick={onClick}>
      <AnimatePresence>
        {animate && (
          <motion.div
            className='selected'
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
          />
        )}
      </AnimatePresence>
      <div>{content}</div>
      <div className={className} />
    </div>
  );
};

type ChatHeaderProps = {
  dmUnread: boolean;
  eventUnread: boolean;
  globalUnread: boolean;
  qaUnread: boolean;
};

export const ChatHeader = (props: ChatHeaderProps) => {
  const { dmUnread, eventUnread, globalUnread, qaUnread } = props;

  const { chatType, eventName, selected, setChatType, setShowChannelList } = useEventContext();

  const handleGlobalClick = useCallback(() => {
    setChatType('global-ve2');
    setShowChannelList(false);
  }, [setChatType, setShowChannelList]);

  const handleEventClick = useCallback(() => {
    const eventType = selected === 'main-event' ? 'main-event' : 'room';
    setChatType(eventType);
    setShowChannelList(false);
  }, [selected, setChatType, setShowChannelList]);

  const handleDirectClick = useCallback(() => {
    setChatType('direct');
    setShowChannelList(true);
  }, [setChatType, setShowChannelList]);

  const handleQAClick = useCallback(() => {
    setChatType('qa');
    setShowChannelList(false);
  }, [setChatType, setShowChannelList]);

  return (
    <div className='chat-components-header'>
      <div className='chat-components-header-top'>
        <CloseChatButton />
        <OnlineUsersIcon />
      </div>
      <div className='chat-components-header-tabs'>
        <HeaderTabItem
          animate={chatType === 'global-ve2'}
          className={`${globalUnread && chatType !== 'global-ve2' ? 'unread' : ''}`}
          content={'Global'}
          onClick={handleGlobalClick}
        />
        {selected !== 'overview' && eventName && (
          <HeaderTabItem
            animate={chatType === 'main-event' || chatType === 'room'}
            className={`${
              eventUnread && chatType !== 'main-event' && chatType !== 'room' ? 'unread' : ''
            }`}
            content={selected === 'main-event' ? 'Event' : 'Room'}
            onClick={handleEventClick}
          />
        )}
        <HeaderTabItem
          animate={chatType === 'direct'}
          className={`${dmUnread && chatType !== 'direct' ? 'unread' : ''}`}
          content={'DM'}
          onClick={handleDirectClick}
        />
        <HeaderTabItem
          animate={chatType === 'qa'}
          className={`${qaUnread && chatType !== 'qa' ? 'unread' : ''}`}
          content={'Q&A'}
          onClick={handleQAClick}
        />
      </div>
    </div>
  );
};

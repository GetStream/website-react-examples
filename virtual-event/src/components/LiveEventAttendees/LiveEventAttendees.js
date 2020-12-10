import React, { useContext } from 'react';
import { ChatContext } from 'stream-chat-react';
import { ModerationSidebar } from '../../assets/ModerationSidebar';
import { ModerationSidebarDark } from '../../assets/ModerationSidebarDark';

import './LiveEventAttendees.css';

export const LiveEventAttendees = () => {
  const { theme } = useContext(ChatContext);
  return (
    <div className="live-event-attendees__container">
      {theme === 'livestream light' ? (
        <ModerationSidebar />
      ) : (
        <ModerationSidebarDark />
      )}
    </div>
  );
};

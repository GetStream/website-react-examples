import React from 'react';

type GamingChatPopUpProps = {
  text: string;
}

export const GamingChatNotification = ({ text }: GamingChatPopUpProps) => <div className='chat-notification'>{text}</div>;

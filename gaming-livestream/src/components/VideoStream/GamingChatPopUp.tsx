import React from 'react';

type GamingChatPopUpProps = {
  text: string;
}

export const GamingChatPopUp = ({ text }: GamingChatPopUpProps) => <div className='gaming-popup'>{text}</div>;

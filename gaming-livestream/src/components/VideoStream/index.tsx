import React from 'react';
import { GamingHeader } from './GamingHeader/GamingHeader';
import { GamingVideo } from './GamingVideo/GamingVideo';
import { GamingChatPopUp } from './GamingChatPopUp';
import { GamingFooter } from './GamingFooter/GamingFooter';
import { useLayoutController } from '../../context/LayoutController';

export const VideoStream = () => {
  const {memberListVisible, popUpText, isFullScreen} = useLayoutController();

  return (
    <div className={`separator ${memberListVisible ? 'show-members' : ''}`}>
      <GamingHeader/>
      <GamingVideo isFullScreen={isFullScreen} />
      {popUpText && <GamingChatPopUp text={popUpText} />}
      <GamingFooter memberListVisible={memberListVisible} isFullScreen={isFullScreen} />
    </div>
  )
}
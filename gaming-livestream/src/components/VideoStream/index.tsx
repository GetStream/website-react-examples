import React from 'react';
import { GamingHeader } from './GamingHeader';
import { GamingVideo } from './GamingVideo';
import { GamingChatPopUp } from './GamingChatPopUp';
import { GamingFooter } from './GamingFooter';
import { useLayoutController } from '../../context/LayoutController';

export const VideoStream = () => {
  const {memberListVisible, popUpText, chatVisible} = useLayoutController();

  return (
    <div className={`video-stream ${memberListVisible} ${chatVisible}`}>
      <GamingHeader/>
      <GamingVideo chatVisible={chatVisible} />
      {popUpText && <GamingChatPopUp text={popUpText} />}
      <GamingFooter memberListVisible={memberListVisible} chatVisible={chatVisible} />
    </div>
  )
}
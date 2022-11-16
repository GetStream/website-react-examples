import React from 'react';
import { GamingHeader } from './GamingHeader';
import { GamingVideo } from './GamingVideo';
import { GamingFooter } from './GamingFooter';
import { useLayoutController } from '../../context/LayoutController';

export const VideoStream = () => {
  const {memberListVisible, chatVisible} = useLayoutController();

  return (
    <div className={`video-stream ${memberListVisible} ${chatVisible}`}>
      <GamingHeader/>
      <GamingVideo chatVisible={chatVisible} />
      <GamingFooter />
    </div>
  )
}
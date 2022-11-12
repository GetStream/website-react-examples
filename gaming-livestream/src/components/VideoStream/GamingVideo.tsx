import React from 'react';
import type { LayoutControllerContext } from '../../context/LayoutController';

type GamingVideoProps = {
  chatVisible: LayoutControllerContext['chatVisible'];
}

export const GamingVideo = ({ chatVisible }: GamingVideoProps) => {
  return (
    <video
      autoPlay
      muted
      loop
      controls
      className={`video-container ${chatVisible}`}
    >
      <source src='https://getstream.io/downloads/react_example-gaming_livestream.mp4' />
    </video>
  );
};

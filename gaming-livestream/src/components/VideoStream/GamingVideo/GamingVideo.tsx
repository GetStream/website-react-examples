import React from 'react';

type GamingVideoProps = {
  isFullScreen: boolean;
}

export const GamingVideo = ({ isFullScreen }: GamingVideoProps) => {
  return (
    <video
      autoPlay
      muted
      loop
      controls
      className={`video-container ${isFullScreen ? 'full-screen' : 'clipped'}`}
    >
      <source src='https://getstream.io/downloads/react_example-gaming_livestream.mp4' />
    </video>
  );
};

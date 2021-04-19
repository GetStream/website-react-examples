import React from 'react';
import './GamingVideo.scss';

export const GamingVideo = (props) => {
  return (
    <video
      autoPlay
      muted
      loop
      controls
      className={`video-container ${props.isFullScreen ? 'full-screen' : 'clipped'}`}
    >
      <source src='https://getstream.io/downloads/react_example-gaming_livestream.mp4' />
    </video>
  );
};

import React from 'react';
import './GamingVideo.scss';

// video file was too big for GH
// need to host it somewhere instead
// import video from '../assets/videos/livestream.webm'

export const GamingVideo = (props) => {
  return (
    <video autoPlay muted loop controls className={`video-container ${props.isFullScreen ? 'full-screen' : 'clipped'}`}>
      <source src={''} />
    </video>
  );
};

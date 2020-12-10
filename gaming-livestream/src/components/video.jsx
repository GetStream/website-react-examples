import React from 'react';
import '../styles/video.scss'

import video from '../assets/videos/livestream.webm'

const Video = props => {

  return (
    <video autoPlay muted loop className={`video-container ${props.isFullScreen ? 'full-screen' : ''}`}>
      <source src={video} />
    </video>
  );
}

export default Video

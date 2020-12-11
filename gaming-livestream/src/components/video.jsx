import React from 'react';
import '../styles/video.scss'

// video file was too big for GH
// need to host it somewhere instead
// import video from '../assets/videos/livestream.webm'

const Video = props => {

  return (
    <video autoPlay muted loop controls className={`video-container ${props.isFullScreen ? 'full-screen' : ''}`}>
      <source src={''} />
    </video>
  );
}

export default Video

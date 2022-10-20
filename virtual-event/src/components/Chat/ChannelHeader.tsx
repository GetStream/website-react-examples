import { CloseX, Ellipse } from '../../assets';
import React from 'react';

type ChannelHeaderProps = {
  onClose: (e: React.BaseSyntheticEvent) => void;
  title: string;
  subtitle?: string;
  menuOpen?: boolean;
  onMenuClick?: () => void;
};

export const ChannelHeader = ({
  menuOpen,
  onMenuClick,
  onClose,
  subtitle,
  title,
}: ChannelHeaderProps) => {
  return (
    <div className='channel-header-container'>
      <div className='channel-header-close-button' onClick={onClose}>
        <CloseX />
      </div>
      <div className='channel-header-title'>
        <div>{title}</div>
        <div className='channel-header-sub-title' title={subtitle || ''}>
          {subtitle}
        </div>
      </div>
      <div
        className={`channel-header-actions-button ${menuOpen ? 'open' : ''}`}
        onClick={onMenuClick}
      >
        <Ellipse />
      </div>
    </div>
  );
};

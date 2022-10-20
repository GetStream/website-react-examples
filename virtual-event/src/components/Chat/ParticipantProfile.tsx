import React, { useCallback, useState } from 'react';
import type { Channel, UserResponse, ExtendableGenerics } from 'stream-chat';
import { Avatar, ReactEventHandler, useChatContext } from 'stream-chat-react';

import { UserActionsDropdown } from './UserActionsDropdown';
import { CloseX, Ellipse, LinkedInLogo, TwitterLogo } from '../../assets';

import { useEventContext } from '../../contexts/EventContext';

import { useBoolState } from '../../hooks/useBoolState';

import { StreamChatType } from '../../types';

type Props<StreamChatType extends ExtendableGenerics> = {
  participantProfile: UserResponse<StreamChatType>;
  setDmChannel: React.Dispatch<React.SetStateAction<Channel | undefined>>;
  setParticipantProfile: React.Dispatch<React.SetStateAction<UserResponse | undefined>>;
};

export const ParticipantProfile = (props: Props<StreamChatType>) => {
  const { participantProfile, setDmChannel, setParticipantProfile } = props;
  const { id, image, name, online, title } = participantProfile;

  const { client } = useChatContext();
  const { setChatType, setShowChannelList } = useEventContext();

  const { state: dropdownOpen, toggle: toggleOpenDropdown, off: closeDropdown } = useBoolState();
  const [imgSrc, setImgSrc] = useState<string | null>(image || null);

  const handleImageLoadError: ReactEventHandler = useCallback(() => {
    setImgSrc(null);
  }, []);

  const handleStartChat = async () => {
    if (!client.userID) return;

    try {
      const newChannel = client.channel('messaging', {
        demo: 'virtual-event',
        members: [client.userID, id],
      });

      await newChannel.watch();

      setChatType('direct');
      setShowChannelList(true);
      setDmChannel(newChannel);
      setParticipantProfile(undefined);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='profile'>
      <div className='profile-header'>
        <div className='profile-header-close' onClick={() => setParticipantProfile(undefined)}>
          <CloseX />
        </div>
        <div
          className={`profile-header-actions ${dropdownOpen ? 'open' : ''}`}
          onClick={toggleOpenDropdown}
        >
          <Ellipse />
        </div>
      </div>
      {dropdownOpen && (
        <UserActionsDropdown
          dropdownOpen={dropdownOpen}
          participantProfile={participantProfile}
          closeDropdown={closeDropdown}
        />
      )}
      <div className='profile-details'>
        {imgSrc ? (
          <img src={imgSrc} alt={imgSrc} onError={handleImageLoadError} />
        ) : (
          <Avatar name={name || id} shape='rounded' size={200} />
        )}
        <div className='profile-details-top'>
          {online && <div className='profile-details-top-online' />}
          <div className='profile-details-top-name'>{name || id}</div>
        </div>
        <div className='profile-details-title'>{title || 'Attendee'}</div>
        <div className='profile-details-logos'>
          <TwitterLogo />
          <LinkedInLogo />
        </div>
      </div>
      <div className='start-chat' onClick={handleStartChat}>
        <div className='start-chat-button'>Start a chat</div>
      </div>
    </div>
  );
};

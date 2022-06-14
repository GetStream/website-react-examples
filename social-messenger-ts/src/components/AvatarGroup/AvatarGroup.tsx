import type { ChannelMemberResponse } from 'stream-chat';
import { Avatar } from 'stream-chat-react';
import { getCleanImage } from '../../assets';
import './AvatarGroup.css';
import StreamLogo from '../../assets/stream.png';
import React from 'react';

export const AvatarGroup = ({ members }: { members: ChannelMemberResponse[] }) => {
  if (members.length === 1) {
    return (
      <div className='avatar-group__avatars'>
        <Avatar image={getCleanImage(members[0])} size={40} />
      </div>
    );
  }

  if (members.length === 2) {
    return (
      <div className='avatar-group__avatars two'>
        <span>
          <Avatar image={getCleanImage(members[0])} shape='square' size={40} />
        </span>
        <span>
          <Avatar image={getCleanImage(members[1])} shape='square' size={40} />
        </span>
      </div>
    );
  }

  if (members.length === 3) {
    return (
      <div className='avatar-group__avatars three'>
        <span>
          <Avatar image={getCleanImage(members[0])} shape='square' size={40} />
        </span>
        <span>
          <Avatar image={getCleanImage(members[1])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[2])} shape='square' size={20} />
        </span>
      </div>
    );
  }

  if (members.length >= 4) {
    return (
      <div className='avatar-group__avatars four'>
        <span>
          <Avatar image={getCleanImage(members[members.length - 1])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[members.length - 2])} shape='square' size={20} />
        </span>
        <span>
          <Avatar image={getCleanImage(members[members.length - 3])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[members.length - 4])} shape='square' size={20} />
        </span>
      </div>
    );
  }

  // fallback for channels with no avatars (single-user channels)
  return (
    <div className='avatar-group__avatars'>
      <Avatar image={StreamLogo} shape='square' size={40} />
    </div>
  );
};

export default AvatarGroup;

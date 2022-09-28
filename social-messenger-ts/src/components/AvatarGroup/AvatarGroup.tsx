import React from 'react';
import type { ChannelMemberResponse } from 'stream-chat';
import { Avatar } from 'stream-chat-react';
import { getCleanImage } from '../../assets';
import './AvatarGroup.css';
import StreamLogo from '../../assets/stream.png';

export const AvatarGroup = ({ members }: { members: ChannelMemberResponse[] }) => {
  let content = <Avatar image={StreamLogo} shape='square' size={40} />;

  if (members.length === 1) {
    content = <Avatar image={getCleanImage(members[0])} size={40} />;
  }

  if (members.length === 2) {
    content = (
      <>
        <div>
          <Avatar image={getCleanImage(members[0])} shape='square' size={40} />
        </div>
        <div>
          <Avatar image={getCleanImage(members[1])} shape='square' size={40} />
        </div>
      </>
    );
  }

  if (members.length === 3) {
    content = (
      <>
        <div>
          <Avatar image={getCleanImage(members[0])} shape='square' size={40} />
        </div>
        <div>
          <Avatar image={getCleanImage(members[1])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[2])} shape='square' size={20} />
        </div>
      </>
    );
  }

  if (members.length >= 4) {
    content = (
      <>
        <div>
          <Avatar image={getCleanImage(members[members.length - 4])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[members.length - 3])} shape='square' size={20} />
        </div>
        <div>
          <Avatar image={getCleanImage(members[members.length - 2])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[members.length - 1])} shape='square' size={20} />
        </div>
      </>
    );
  }

  // fallback for channels with no avatars (single-user channels)
  return (
    <div className='avatar-group'>
      {content}
    </div>
  );
};

export default AvatarGroup;

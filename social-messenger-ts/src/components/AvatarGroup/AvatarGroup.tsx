import clsx from "clsx";
import React, {ComponentProps} from 'react';
import type { ChannelMemberResponse } from 'stream-chat';
import { Avatar } from 'stream-chat-react';
import { getCleanImage } from '../../assets';
import './AvatarGroup.css';
import StreamLogo from '../../assets/ProfilePic_LogoMark_GrdntOnWt.png';

const AvatarSubgroup = (props: ComponentProps<'div'>) => <div {...props} className={clsx('avatar-subgroup', {'avatar-subgroup--split': React.Children.toArray(props.children).length > 1})}/>

export const AvatarGroup = ({ members }: { members: ChannelMemberResponse[] }) => {
  let content = <Avatar imageUrl={StreamLogo} size='lg' />;

  if (members.length === 1) {
    content = <Avatar imageUrl={getCleanImage(members[0])} size='lg' />;
  }

  if (members.length === 2) {
    content = (
      <>
        <AvatarSubgroup>
          <Avatar imageUrl={getCleanImage(members[0])} size='lg' />
        </AvatarSubgroup>
        <AvatarSubgroup>
          <Avatar imageUrl={getCleanImage(members[1])} size='lg' />
        </AvatarSubgroup>
      </>
    );
  }

  if (members.length === 3) {
    content = (
      <>
        <AvatarSubgroup>
          <Avatar imageUrl={getCleanImage(members[0])} size='lg' />
        </AvatarSubgroup>
        <AvatarSubgroup>
          <Avatar imageUrl={getCleanImage(members[1])} size='xs' />
          <Avatar imageUrl={getCleanImage(members[2])} size='xs' />
        </AvatarSubgroup>
      </>
    );
  }

  if (members.length >= 4) {
    content = (
      <>
        <AvatarSubgroup>
          <Avatar imageUrl={getCleanImage(members[members.length - 4])} size='xs' />
          <Avatar imageUrl={getCleanImage(members[members.length - 3])} size='xs' />
        </AvatarSubgroup>
        <AvatarSubgroup>
          <Avatar imageUrl={getCleanImage(members[members.length - 2])} size='xs' />
          <Avatar imageUrl={getCleanImage(members[members.length - 1])} size='xs' />
        </AvatarSubgroup>
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

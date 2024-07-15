import clsx from "clsx";
import React, {ComponentProps} from 'react';
import type { ChannelMemberResponse } from 'stream-chat';
import { Avatar } from 'stream-chat-react';
import { getCleanImage } from '../../assets';
import './AvatarGroup.css';
import StreamLogo from '../../assets/ProfilePic_LogoMark_GrdntOnWt.png';

const AvatarSubgroup = (props: ComponentProps<'div'>) => <div {...props} className={clsx('avatar-subgroup', {'avatar-subgroup--split': React.Children.toArray(props.children).length > 1})}/>

export const AvatarGroup = ({ members }: { members: ChannelMemberResponse[] }) => {
  let content = <Avatar image={StreamLogo} />;

  if (members.length === 1) {
    content = <Avatar image={getCleanImage(members[0])} />;
  }

  if (members.length === 2) {
    content = (
      <>
        <AvatarSubgroup>
          <Avatar image={getCleanImage(members[0])} />
        </AvatarSubgroup>
        <AvatarSubgroup>
          <Avatar image={getCleanImage(members[1])} />
        </AvatarSubgroup>
      </>
    );
  }

  if (members.length === 3) {
    content = (
      <>
        <AvatarSubgroup>
          <Avatar image={getCleanImage(members[0])} />
        </AvatarSubgroup>
        <AvatarSubgroup>
          <Avatar image={getCleanImage(members[1])} />
          <Avatar image={getCleanImage(members[2])} />
        </AvatarSubgroup>
      </>
    );
  }

  if (members.length >= 4) {
    content = (
      <>
        <AvatarSubgroup>
          <Avatar image={getCleanImage(members[members.length - 4])} />
          <Avatar image={getCleanImage(members[members.length - 3])} />
        </AvatarSubgroup>
        <AvatarSubgroup>
          <Avatar image={getCleanImage(members[members.length - 2])} />
          <Avatar image={getCleanImage(members[members.length - 1])} />
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

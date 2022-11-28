import StreamerIcon from '../../assets/icons/StreamerIcon';
import ModeratorIcon from '../../assets/icons/ModeratorIcon';
import VIPIcon from '../../assets/icons/VIPIcon';
import DefaultUserIcon from '../../assets/icons/DefaultUserIcon';

import type { UserRole } from '../../types';

type UserIconProps = { type?: UserRole | null }

export const UserIcon = ({ type }: UserIconProps) => {
  switch (type) {
    case 'streamer':
      return <StreamerIcon/>;
    case 'moderator':
      return <ModeratorIcon/>;
    case 'VIP':
      return <VIPIcon/>;
    default:
      return <DefaultUserIcon/>;
  }
};
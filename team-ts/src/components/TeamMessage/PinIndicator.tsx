import { PinIcon } from '../../assets';
import type {LocalMessage} from "stream-chat";



export type PinIndicatorProps = {
  message?: LocalMessage;
};

export const PinIndicator = ({ message }: PinIndicatorProps) => {
  if (!message) return null;

  return (
    <div className='str-chat__message-team-pin-indicator'>
        <PinIcon />
          {message.pinned_by
            ? `Pinned by ${message.pinned_by?.name || message.pinned_by?.id}`
            : 'Message pinned'}
    </div>
  );
};

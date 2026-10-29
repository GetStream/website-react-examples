import { MouseEventHandler, useCallback } from 'react';
import type { ChannelStateData } from 'stream-chat';
import {
  Avatar,
  useChannel,
  useChatContext,
  useStateStore,
  useWorkspaceNavigation,
} from 'stream-chat-react';

import { PinIcon } from '../../assets';

import { ChannelInfoIcon } from './ChannelInfoIcon';
import { useWorkspaceController } from '../../context/WorkspaceController';


const channelStateSelector = ({ data, members, watcherCount }: ChannelStateData) => ({
  data,
  members,
  watcherCount,
});

export const TeamChannelHeader = () => {
  const { displayWorkspace } = useWorkspaceController();
  const { client } = useChatContext();
  const channel = useChannel();
  const { data, members: membersById, watcherCount } = useStateStore(channel.state, channelStateSelector);
  const { closeThread } = useWorkspaceNavigation();
  const { togglePinnedMessageListOpen } = useWorkspaceController();

  const teamHeader = `# ${data?.custom?.name || data?.id || 'random'}`;

  const openChannelEditPanel = useCallback(() => {
    displayWorkspace('Admin-Channel-Edit');
  }, [displayWorkspace]);

  const onPinIconClick: MouseEventHandler = useCallback(() => {
    closeThread();
    togglePinnedMessageListOpen();
  }, [closeThread, togglePinnedMessageListOpen])

  const getMessagingHeader = () => {
    const members = Object.values(membersById).filter(
      ({ user }) => user?.id !== client.userID,
    );
    const additionalMembers = members.length - 3;

    if (!members.length) {
      return (
        <div className='workspace-header__block'>
          <Avatar size='md' />
          <p className='team-channel-header__name user'>Johnny Blaze</p>
        </div>
      );
    }

    return (
      <div className='workspace-header__block'>
        {members.map(({ user }, i) => {
          if (i > 2) return null;
          return (
            <div key={i} className='workspace-header__block-item'>
              <Avatar imageUrl={user?.image} size='md' userName={user?.name || user?.id} />
              <p className='team-channel-header__name user'>
                {user?.name || user?.id || 'Johnny Blaze'}
              </p>
            </div>
          );
        })}
        {additionalMembers > 0 && (
          <p className='team-channel-header__name user'>{`and ${additionalMembers} more`}</p>
        )}
      </div>
    );
  };

  const getWatcherText = (watchers?: number) => {
    if (!watchers) return 'No users online';
    if (watchers === 1) return '1 user online';
    return `${watchers} users online`;
  };

  return (
    <div className='team-channel-header__container'>
      {channel.type === 'messaging' ? (
        getMessagingHeader()
      ) : (
        <div className='workspace-header__block'>
          <div className='team-channel-header__name workspace-header__title'>{teamHeader}</div>
          <button onClick={openChannelEditPanel}>
            <ChannelInfoIcon />
          </button>
        </div>
      )}
      <div className='workspace-header__block'>
        <div className='workspace-header__subtitle'>{getWatcherText(watcherCount)}</div>
        <button
          className='workspace-header__subtitle'
          onClick={onPinIconClick}
        >
          <PinIcon />
          Pins
        </button>
      </div>
    </div>
  );
};

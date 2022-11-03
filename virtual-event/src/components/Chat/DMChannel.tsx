import React from 'react';
import { Channel as StreamChannel } from 'stream-chat';
import { Channel } from 'stream-chat-react';

import { ChannelInner } from './ChannelInner';
import { EmptyStateIndicatorChannel } from './EmptyStateIndicators';
import { GiphyPreview } from './GiphyPreview';
import { MessageUI } from './MessageUI';
import { MessageInputUI } from './MessageInputUI';
import { SuggestionHeader, SuggestionListItem } from './SuggestionList';
import { ThreadHeader } from './ThreadHeader';
import { UserActionsDropdown } from './UserActionsDropdown';
import { StreamChatType } from '../../types';
import { useBoolState } from '../../hooks/useBoolState';
import { ChannelHeader } from './ChannelHeader';

// todo: remove AutocompleteSuggestionHeader prop

type Props = {
  dmChannel: StreamChannel;
  setDmChannel: React.Dispatch<React.SetStateAction<StreamChannel | undefined>>;
};

export const DMChannel: React.FC<Props> = (props) => {
  const { dmChannel, setDmChannel } = props;

  const { state: dropdownOpen, toggle: toggleOpenDropdown, off: closeDropdown } = useBoolState();

  const user = dmChannel.state.membership.user?.id;

  const otherUsersIDs = Object.keys(dmChannel.state.members).filter((key) => key !== user);
  const otherUserID = otherUsersIDs[0];
  const channelTitle = dmChannel.state.members[otherUserID].user?.name || otherUserID;

  return (
    <div className='dm-channel'>
      <ChannelHeader
        onClose={() => setDmChannel(undefined)}
        menuOpen={dropdownOpen}
        title={channelTitle}
        subtitle='Direct Message'
        onMenuClick={toggleOpenDropdown}
      />
      {dropdownOpen && (
        <UserActionsDropdown
          dropdownOpen={dropdownOpen}
          dmChannel={dmChannel}
          closeDropdown={closeDropdown}
        />
      )}
      <Channel<StreamChatType>
        AutocompleteSuggestionHeader={SuggestionHeader}
        AutocompleteSuggestionItem={SuggestionListItem}
        channel={dmChannel}
        EmptyStateIndicator={(props) => <EmptyStateIndicatorChannel {...props} isDmChannel />}
        GiphyPreviewMessage={GiphyPreview}
        Input={MessageInputUI}
        ThreadHeader={ThreadHeader}
        VirtualMessage={MessageUI}
      >
        <ChannelInner />
      </Channel>
    </div>
  );
};

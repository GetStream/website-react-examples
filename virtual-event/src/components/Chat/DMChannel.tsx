import React from 'react';
import {Channel as StreamChannel} from 'stream-chat';
import {type EmptyStateIndicatorProps, WithComponents} from 'stream-chat-react';

import {ChannelWithThread} from './ChannelWithThread';
import {EmptyStateIndicatorChannel} from './EmptyStateIndicators';
import {GiphyPreview} from './GiphyPreview';
import {MessageUI} from './MessageUI';
import {MessageInputUI} from './MessageInputUI';
import {CustomSuggestionList} from './SuggestionList';
import {UserActionsDropdown} from './UserActionsDropdown';

import {useBoolState} from '../../hooks/useBoolState';
import {ChannelHeader} from './ChannelHeader';

// todo: remove AutocompleteSuggestionHeader prop

const EmptyStateIndicatorDMChannel = (props: EmptyStateIndicatorProps) => (
  <EmptyStateIndicatorChannel {...props} isDmChannel />
);

const dmChannelOverrides = {
  AutocompleteSuggestionList: CustomSuggestionList,
  EmptyStateIndicator: EmptyStateIndicatorDMChannel,
  GiphyPreviewMessage: GiphyPreview,
  MessageComposerUI: MessageInputUI,
  // a message UI receives no props in v15
  VirtualMessage: () => <MessageUI />,
};

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
      <WithComponents overrides={dmChannelOverrides}>
        <ChannelWithThread channel={dmChannel} />
      </WithComponents>
    </div>
  );
};

import { Avatar, ChannelListItemUIProps, useChatContext } from 'stream-chat-react';

type DirectMessagingChannelPreviewProps = Pick<ChannelListItemUIProps, 'channel'>;

export const DirectMessagingChannelPreview = ({channel}: DirectMessagingChannelPreviewProps) => {
  const { client } = useChatContext();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID,
  );
  const defaultName = 'Johnny Blaze';
  let displayText;

  if (!members.length || members.length === 1) {
    const member = members[0];
    displayText = member?.user?.name || member?.user?.id || defaultName;
    return (
      <div className='channel-preview__item single' title={displayText}>
        <Avatar
          imageUrl={member.user?.image}
          size='sm'
          userName={member.user?.name || member.user?.id}
        />
        <p>{displayText}</p>
      </div>
    );
  }

  displayText = [
      (members[0].user?.name || members[0].user?.id || defaultName),
      (members[1].user?.name || members[1].user?.id || defaultName)
  ].join(' ');
  return (
    <div className='channel-preview__item multi' title={displayText}>
        <span>
          <Avatar
            imageUrl={members[0].user?.image}
            size='xs'
            userName={members[0].user?.name || members[0].user?.id}
          />
        </span>
      <Avatar
        imageUrl={members[1].user?.image}
        size='xs'
        userName={members[1].user?.name || members[1].user?.id}
      />
      <p>{displayText}</p>
    </div>
  );
};
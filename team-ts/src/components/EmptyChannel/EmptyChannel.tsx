import { Avatar, useChatContext } from 'stream-chat-react';

import { HashIcon } from './HashIcon';

export const EmptyChannel = () => {
  const { channel, client } = useChatContext();

  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user?.id !== client.userID,
  );

  const getAvatarGroup = () => {
    if (!members.length) return <Avatar />;

    return (
      <div className='channel-empty__avatars'>
        {members.slice(0,2).map((member, i) => {
          return (
            <Avatar
              key={i}
              image={member.user?.image}
              name={member.user?.name || member.user?.id}
            />
          );
        })}
      </div>
    );
  };

  const getUserText = () => {
    if (members.length === 1) {
      return (
        <span className='channel-empty__user-name'>{`@${
          members[0].user?.name || members[0].user?.id
        }`}</span>
      );
    }

    if (members.length === 2) {
      return (
        <span className='channel-empty__user-name'>{`@${
          members[0].user?.name || members[0].user?.id
        } and @${members[1].user?.name || members[1].user?.id}`}</span>
      );
    }

    let memberString = '';

    members.forEach((member, i) => {
      if (i !== members.length - 1) {
        memberString = `${memberString}@${member?.user?.name || member?.user?.id}, `;
      } else {
        memberString = `${memberString} and @${member?.user?.name || member?.user?.id}`;
      }
    });

    return <span className='channel-empty__user-name'>{memberString || 'the Universe'}</span>;
  };

  return (
    <div className='channel-empty__container'>
      {channel?.type === 'team' ? <HashIcon /> : getAvatarGroup()}
      <p className='channel-empty__main-description'>
        This is the beginning of your chat history
        {channel?.type === 'team' ? ' in ' : ' with '}
        {channel?.type === 'team' ? `#${channel?.data?.name || channel?.data?.id}` : getUserText()}.
      </p>
      <p className='channel-empty__secondary-description'>Send messages, attachments, links, emojis, and more.</p>
    </div>
  );
};

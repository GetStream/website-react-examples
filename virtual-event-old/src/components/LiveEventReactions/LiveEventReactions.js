import React, { useState } from 'react';
import { useChannelStateContext, useComponentContext } from 'stream-chat-react';

import './LiveEventReactions.css';

export const LiveEventReactions = ({
  reactions,
  reaction_counts,
  reactionOptions: propsReactionOptions,
  handleReaction,
}) => {
  const { emojiConfig } = useChannelStateContext();
  const { Emoji } = useComponentContext();

  const { defaultMinimalEmojis, emojiSetDef, emojiData } = emojiConfig || {};

  const reactionOptions = propsReactionOptions || defaultMinimalEmojis;

  const [tooltipReactionType, setTooltipReactionType] = useState(null);

  if (!reactions || reactions.length === 0) {
    return null;
  }

  const getUsersPerReactionType = (type) =>
    reactions
      ?.map((reaction) => {
        if (reaction.type === type) {
          return reaction.user?.name || reaction.user?.id;
        }
        return null;
      })
      .filter(Boolean);

  const getReactionTypes = () => {
    if (!reactions) return [];
    const allTypes = new Set();
    reactions.forEach(({ type }) => {
      allTypes.add(type);
    });
    return Array.from(allTypes).sort();
  };

  const getOptionForType = (type) => reactionOptions.find((option) => option.id === type);

  return (
    <ul
      data-testid='simple-reaction-list'
      className='live-event__simple-reactions-list'
      onMouseLeave={() => setTooltipReactionType(null)}
    >
      {getReactionTypes().map((reactionType, i) => {
        const emojiDefinition = getOptionForType(reactionType);
        return emojiDefinition ? (
          <li
            className={
              i > 0
                ? 'live-event__simple-reactions-list-item__border'
                : 'live-event__simple-reactions-list-item'
            }
            key={`${emojiDefinition?.id}-${i}`}
            onClick={() => handleReaction && handleReaction(reactionType)}
          >
            <span onMouseEnter={() => setTooltipReactionType(reactionType)}>
              <Emoji emoji={emojiDefinition} {...emojiSetDef} size={16} data={emojiData} />
              &nbsp;
            </span>
            {reactions?.length !== 0 && (
              <div className='live-event__simple-reactions-list-item--last-number'>
                {(reaction_counts[reactionType] !== undefined || reaction_counts[reactionType]) ===
                0
                  ? 1
                  : reaction_counts[reactionType]}
              </div>
            )}
            {tooltipReactionType === getOptionForType(reactionType)?.id && (
              <div className='str-chat__simple-reactions-list-tooltip'>
                <div className='arrow' />
                {getUsersPerReactionType(tooltipReactionType)?.join(', ')}
              </div>
            )}
          </li>
        ) : null;
      })}
    </ul>
  );
};

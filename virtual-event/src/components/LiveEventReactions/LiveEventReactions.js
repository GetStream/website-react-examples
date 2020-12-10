import React, { useState } from 'react';
import { NimbleEmoji } from 'emoji-mart';
import {
  defaultMinimalEmojis,
  emojiSetDef,
  emojiData,
} from 'stream-chat-react';

import './LiveEventReactions.css';

export const LiveEventReactions = ({
  reactions,
  reaction_counts,
  reactionOptions = defaultMinimalEmojis,
  handleReaction,
}) => {
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
    return Array.from(allTypes);
  };

  const getOptionForType = (type) =>
    reactionOptions.find((option) => option.id === type);

  return (
    <ul
      data-testid="simple-reaction-list"
      className="live-event__simple-reactions-list"
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
              <NimbleEmoji
                // emoji-mart type defs don't support spriteSheet use case
                // (but implementation does)
                // @ts-ignore
                emoji={emojiDefinition}
                {...emojiSetDef}
                size={16}
                data={emojiData}
              />
              &nbsp;
            </span>
            {reactions?.length !== 0 && (
              <div className="live-event__simple-reactions-list-item--last-number">
                {Object.values(reaction_counts)[i] === 0
                  ? 1
                  : Object.values(reaction_counts)[i]}
              </div>
            )}
            {tooltipReactionType === getOptionForType(reactionType)?.id && (
              <div className="str-chat__simple-reactions-list-tooltip">
                <div className="arrow" />
                {getUsersPerReactionType(tooltipReactionType)?.join(', ')}
              </div>
            )}
          </li>
        ) : null;
      })}
    </ul>
  );
};

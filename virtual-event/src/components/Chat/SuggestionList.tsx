import React from 'react';
import {Avatar, SuggestionCommand, SuggestionItemProps, SuggestionUser,} from 'stream-chat-react';

import {Ban, Flag, Giphy, Mute, Unban, Unmute} from '../../assets';

type Emoji = { id: string; native: string; name: string };

const isEmoji = (output: SuggestionItem): output is Emoji => (output as Emoji).native != null;

const isMention = (output: SuggestionItem): output is SuggestionUser =>
  (output as SuggestionUser).id != null && (output as SuggestionUser).native == null;

const isEmojiOrMention = (output: SuggestionItem): output is Emoji | SuggestionUser =>
  (output as Emoji | SuggestionUser).id != null;

const getCommandIcon = (name?: string) => {
  let description;
  let Icon;

  switch (name) {
    case 'ban':
      description = '/ban [@username] [text]';
      Icon = Ban;
      break;
    case 'flag':
      description = '/flag [@username]';
      Icon = Flag;
      break;
    case 'giphy':
      description = '/giphy [query]';
      Icon = Giphy;
      break;
    case 'mute':
      description = '[@username]';
      Icon = Mute;
      break;
    case 'unban':
      description = '[@username]';
      Icon = Unban;
      break;
    case 'unmute':
      description = '[@username]';
      Icon = Unmute;
      break;
    default:
      break;
  }

  return { description, Icon };
};

type SuggestionItem = Emoji | SuggestionUser | SuggestionCommand;

export const SuggestionListItem = React.forwardRef(
  (props: SuggestionItemProps, ref: React.Ref<HTMLDivElement>) => {
    const { item, onClickHandler, onSelectHandler, selected } = props;

    const selectItem = () => onSelectHandler(item);

    const { description, Icon } = getCommandIcon(item.name);

    const itemName = isEmojiOrMention(item) ? item.name || item.id : item.name;
    const displayText = isEmoji(item) ? `${item.native}- ${itemName}` : itemName;

    return (
      <div
        className={`suggestion-item ${selected ? 'selected' : ''}`}
        onClick={(event) => onClickHandler(event, item)}
        onMouseEnter={selectItem}
        ref={ref}
        role='button'
        tabIndex={0}
      >
        {!isEmojiOrMention(item) && (
          <div className='suggestion-item-icon'>{Icon ? <Icon /> : null}</div>
        )}
        {isMention(item) ? <Avatar image={item.image} /> : null}
        <div>{displayText}</div>
        <div className='suggestion-item-description'>{description}</div>
      </div>
    );
  },
);

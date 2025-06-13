import React from 'react';
import type {CommandResponse} from "stream-chat";
import {
  Avatar,
  EmojiSearchIndexResult,
  SuggestionList,
  type SuggestionListItemComponentProps, SuggestionListProps, UserItemProps,
} from 'stream-chat-react';

import {Ban, Flag, Giphy, Mute, Unban, Unmute} from '../../assets';


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


const CommandSuggestionItemComponent = (props: SuggestionListItemComponentProps) => {
  const entity = props.entity as CommandResponse;
  if (!entity) return null;

  const { description, Icon } = getCommandIcon(entity.name);
  return (
    <div className='suggestion-item'>
      {Icon && <div className='suggestion-item-icon'><Icon/></div>}
      <div>{entity.name}</div>
      <div className='suggestion-item-description'>{description}</div>
    </div>
  );
}

const MentionSuggestionItemComponent = (props: SuggestionListItemComponentProps) => {
  const entity = props.entity as UserItemProps['entity'];
  if (!entity) return null;

  return (
    <div className='suggestion-item'>
      <Avatar image={entity.image} />
      <div>{entity.name}</div>
    </div>
  );
}

const EmojiSuggestionItemComponent = (props: SuggestionListItemComponentProps) => {
  const entity = props.entity as EmojiSearchIndexResult;
  if (!entity) return null;
  const displayText = `${entity.native} ${entity.name || entity.id};`;
  return (
    <div className='suggestion-item'>
      <div>{displayText}</div>
    </div>
  );
}

const suggestionItemComponents: Record<
  string,
  React.ComponentType<SuggestionListItemComponentProps>
> = {
  '/': CommandSuggestionItemComponent,
  ':': EmojiSuggestionItemComponent,
  '@': MentionSuggestionItemComponent,
}

export const CustomSuggestionList = (props: SuggestionListProps) => <SuggestionList {...props} suggestionItemComponents={suggestionItemComponents}/>

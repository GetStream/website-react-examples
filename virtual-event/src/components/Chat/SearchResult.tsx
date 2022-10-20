import React from 'react';
import { Avatar, isChannel, SearchResultItemProps } from 'stream-chat-react';

import { StreamChatType } from '../../types';

export const SearchResult: React.FC<SearchResultItemProps<StreamChatType>> = (props) => {
  const { focusedUser, index, result, selectResult } = props;

  const focused = focusedUser === index;

  if (isChannel(result)) return null;

  return (
    <div
      className={`search-result ${focused ? 'focused' : ''}`}
      onClick={() => selectResult(result)}
    >
      <Avatar image={result.image} name={result.name || result.id} user={result} />
      <div className='search-result-info'>
        <div className='search-result-info-name'>{result.name || result.id}</div>
        <div className='search-result-info-title'>{result.title || 'Attendee'}</div>
      </div>
    </div>
  );
};

import React from 'react';
import type { UserResponse } from 'stream-chat';
import { Avatar } from 'stream-chat-react';

type SearchResultProps = {
  index: number;
  result: UserResponse;
  selectResult: (result: UserResponse) => void;
  focusedUser?: number;
};

export const SearchResult: React.FC<SearchResultProps> = (props) => {
  const { focusedUser, index, result, selectResult } = props;

  const focused = focusedUser === index;

  return (
    <div
      className={`search-result ${focused ? 'focused' : ''}`}
      onClick={() => selectResult(result)}
    >
      <Avatar imageUrl={result.image} size='md' userName={result.name || result.id} />
      <div className='search-result-info'>
        <div className='search-result-info-name'>{result.name || result.id}</div>
        <div className='search-result-info-title'>{result.title || 'Attendee'}</div>
      </div>
    </div>
  );
};

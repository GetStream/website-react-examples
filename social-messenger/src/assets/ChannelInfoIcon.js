import React from 'react';

export const ChannelInfoIcon = ({ isEditing, setIsEditing }) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ cursor: 'pointer', marginLeft: '16px' }}
    onClick={() => {
      if (!isEditing) {
        setIsEditing(true);
      }
    }}
  >
    <path
      d='M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2Z'
      fill='#858688'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M13 8L13 6H11V8H13ZM13 10H11V18H13V10Z'
      fill='white'
    />
  </svg>
);

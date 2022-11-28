import React from 'react';

const DefaultUserIcon = () => (
  <svg className='user-icon' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect width='16' height='16' rx='2' fill='#0D47D9' />
    <circle cx='8' cy='4' r='3' fill='white' />
    <path
      d='M6.99998 6H8.99998C8.99998 6 9.99996 13 12 13C14.0001 13 1.99994 13 3.99994 13C5.99994 13 6.99998 6 6.99998 6Z'
      fill='white'
    />
    <rect x='3' y='13' width='10' height='2' rx='1' fill='white' />
    <rect x='5' y='6.7' width='6' height='2.3' rx='1' fill='white' />
  </svg>
);

export default DefaultUserIcon;

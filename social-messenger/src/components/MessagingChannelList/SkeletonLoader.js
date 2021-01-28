import React from 'react';

export const SkeletonLoader = () => {
  return (
    <div style={{ position: 'relative' }}>
      <ul className='skeleton-loader__list'>
        <li>
          <div className='skeleton-loader__avatar'></div>
          <div className='skeleton-loader__text'>
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className='skeleton-loader__avatar'></div>
          <div className='skeleton-loader__text'>
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className='skeleton-loader__avatar'></div>
          <div className='skeleton-loader__text'>
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className='skeleton-loader__avatar'></div>
          <div className='skeleton-loader__text'>
            <div></div>
            <div></div>
          </div>
        </li>
        <li>
          <div className='skeleton-loader__avatar'></div>
          <div className='skeleton-loader__text'>
            <div></div>
            <div></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

import React from 'react';
import './SloMoToggle.css';

export const SloMoToggle = ({ isOn, handleToggle, onColor }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className='slo-mo-toggle__container'
        id={`react-switch-new`}
        type='checkbox'
      />
      <label
        style={{ background: isOn && onColor }}
        className='slo-mo-toggle__label '
        htmlFor={`react-switch-new`}
      >
        <span className={`slo-mo-toggle__button`} />
      </label>
    </>
  );
};

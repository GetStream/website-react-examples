import React, { useEffect, useRef } from 'react';
import './SloMoModal.css';
import { SloMoToggle } from './SloMoToggle';

export const SloMoModal = ({
  sloMoDelay,
  setShowModal,
  setSloMoDelay,
  setToggleSwitchPosition,
  toggleSwitchPosition,
}) => {
  const wrapperRef = useRef(null);

  // eslint-disable-next-line consistent-return
  const handleChange = (event) => {
    if (!toggleSwitchPosition) {
      return null;
    }
    if (event.target.value < 0) {
      setSloMoDelay(0);
    } else if (event.target.value > 100) {
      setSloMoDelay(100);
    } else {
      setSloMoDelay(event.target.value);
    }
  };
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowModal(false);
        }
      }

      // Bind the event listener
      document.addEventListener('click', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('click', handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);
  return (
    <div ref={wrapperRef} className='slo-mo-modal__container'>
      <div className='slo-mo-modal__container__top '>
        <div>Slow Mode</div>
        <div>
          <SloMoToggle
            isOn={toggleSwitchPosition}
            onColor='#20e070'
            handleToggle={() => {
              if (toggleSwitchPosition) {
                setSloMoDelay(0);
              }
              setToggleSwitchPosition(!toggleSwitchPosition);
            }}
          />
        </div>
      </div>
      <div className='slo-mo-modal__container__bottom '>
        <div>Seconds 1-100</div>
        <div>
          <input
            onChange={handleChange}
            className='slo-mo-modal__text-input'
            min='0'
            max='100'
            type='number'
            value={sloMoDelay}
          ></input>
        </div>
      </div>
    </div>
  );
};

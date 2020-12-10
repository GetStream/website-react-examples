import React from 'react';
import './SloMoModal.css';
import { SloMoToggle } from './SloMoToggle';

export const SloMoModal = ({
  sloMoDelay,
  setSloMoDelay,
  setToggleSwitchPosition,
  toggleSwitchPosition,
}) => {
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

  return (
    <div className="slo-mo-modal__container">
      <div className="slo-mo-modal__container__top ">
        <div>Slow Mode</div>
        <div>
          <SloMoToggle
            isOn={toggleSwitchPosition}
            onColor="#20e070"
            handleToggle={() => {
              if (toggleSwitchPosition) {
                setSloMoDelay(0);
              }
              setToggleSwitchPosition(!toggleSwitchPosition);
            }}
          />
        </div>
      </div>
      <div className="slo-mo-modal__container__bottom ">
        <div>Seconds 1-100</div>
        <div>
          <input
            onChange={handleChange}
            className="slo-mo-modal__text-input"
            min="0"
            max="100"
            type="number"
            value={sloMoDelay}
          ></input>
        </div>
      </div>
    </div>
  );
};

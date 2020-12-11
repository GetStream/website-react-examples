import React, { useState } from 'react';
import { HuePicker } from 'react-color';

import './ColorSlider.css';

export const ColorSlider = ({ primaryColor }) => {
  const [sliderOpen, setSliderOpen] = useState(false);

  return (
    <div className='color-slider__container'>
      <div className='color-slider__top' onClick={() => setSliderOpen(!sliderOpen)}>
        <p className='color-slider__top__text'>COLOR</p>
        <div className='color-slider__top__circle' />
      </div>
      {sliderOpen && (
        <div className='color-slider__picker-wrapper'>
          <HuePicker
            color={`rgb(${primaryColor})`}
            onChange={(color) => {
              primaryColor.current = `${color.rgb.r - 50}, ${color.rgb.g - 50}, ${color.rgb.b - 50}`;
              const body = document.querySelector('body');
              body.style.setProperty('--primary-color', primaryColor.current);
            }}
            height='10px'
            width='200px'
            pointer={() => <div className='color-slider__pointer' />}
          />
        </div>
      )}
    </div>
  );
};

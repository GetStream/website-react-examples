import React, { useState } from 'react';
import { HuePicker } from 'react-color';

import './ColorSlider.css';

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const ColorSlider = ({ primaryColor, setColor }) => {
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
            color={`${hexToRgb('#1e90ff')}`}
            onChange={(color) => {
              setColor(color.hex)
              // primaryColor.current = `${color.rgb.r - 50}, ${color.rgb.g - 50}, ${color.rgb.b - 50}`;
              // const body = document.querySelector('body');
              // body.style.setProperty('--primary-color', primaryColor.current);
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
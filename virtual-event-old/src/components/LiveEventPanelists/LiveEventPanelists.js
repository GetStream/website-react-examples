import React from 'react';
import { useChatContext } from 'stream-chat-react';

import { LinkedInLogo } from '../../assets/LinkedInLogo';
import { TwitterLogo } from '../../assets/TwitterLogo';
import BrianGreen from '../../assets/BrianGreene.png';
import NeilDT from '../../assets/NDT.png';
import BillNye from '../../assets/BillNye.png';

import './LiveEventPanelists.css';

export const LiveEventPanelists = () => {
  const { theme } = useChatContext();

  return (
    <div
      className={theme === 'livestream light' ? 'panelists-container' : 'panelists-container-dark'}
    >
      <div className='panelists-top'>
        <div className='panelists-top__left'>
          <div className='panelists-top__left-title'>The Storytelling of Science</div>
          <div className='panelists-top__left-tags'>
            <div className='panelists-top__left-tag' style={{ background: '#19A0FF' }}>
              Technology
            </div>
            <div className='panelists-top__left-tag' style={{ background: '#8c19ff' }}>
              Science
            </div>
            <div className='panelists-top__left-tag' style={{ background: '#ff8a00' }}>
              Storytelling
            </div>
          </div>
          <div className='panelists-top__left-description'>
            Join us in watching experts at Arizona State University discuss the science and future
            of storytelling.
          </div>
        </div>
      </div>
      <div className='panelists-bottom'>
        <div className='panelists-bottom__title'>Panelists</div>
        <div className='panelists-bottom__panelists'>
          <div className='panelists-bottom__panelist'>
            <div className='panelists-bottom__panelist-left'>
              <img alt='' style={{ height: '42px', width: '42px' }} src={BrianGreen}></img>
              <div className='panelists-names'>
                <div className='panelists-name'>Brian</div>
                <div className='panelists-name'>Green</div>
              </div>
            </div>
            <div className='panelists-bottom__panelist-right'>
              <LinkedInLogo />
              <TwitterLogo />
            </div>
          </div>
          <div className='panelists-bottom__panelist'>
            <div className='panelists-bottom__panelist-left'>
              <img alt='' style={{ height: '42px', width: '42px' }} src={NeilDT}></img>
              <div className='panelists-names'>
                <div className='panelists-name'>Neil deGrasse</div>
                <div className='panelists-name'>Tyson</div>
              </div>
            </div>
            <div className='panelists-bottom__panelist-right'>
              <LinkedInLogo />
              <TwitterLogo />
            </div>
          </div>
          <div className='panelists-bottom__panelist'>
            <div className='panelists-bottom__panelist-left'>
              <img alt='' style={{ height: '42px', width: '42px' }} src={BillNye}></img>
              <div className='panelists-names'>
                <div className='panelists-name'>Bill</div>
                <div className='panelists-name'>Nye</div>
              </div>
            </div>
            <div className='panelists-bottom__panelist-right'>
              <LinkedInLogo />
              <TwitterLogo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

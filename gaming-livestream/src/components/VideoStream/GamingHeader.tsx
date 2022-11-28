import React from 'react';

import ControllerIcon from '../../assets/icons/ControllerIcon';
import HeartFullIcon from '../../assets/icons/HeartFullIcon';
import LiveIcon from '../../assets/icons/LiveIcon';
import PeopleIcon from '../../assets/icons/PeopleIcon';
import SubscribeFullIcon from '../../assets/icons/SubscribeFullIcon';
import WatcherIcon from '../../assets/icons/WatcherIcon';

import {useLayoutController} from '../../context/LayoutController';
import {ChatIcon} from '../../assets/icons/ChatIcon';

export const GamingHeader = () => {
	const {chatVisible, toggleFullScreen} = useLayoutController();

	const title = '2200+ Wins, #1 Warzone Battle Royale All Platforms Wins';

	return (
			<header>
				<div className='stream-details'>
					<LiveIcon/>
					<div className='info'>
						<h2 title={title}>{title}</h2>
						<div className='game-details'>
							<div>
								<ControllerIcon/>
								<p>Overwatch</p>
							</div>
							<div>
								<PeopleIcon/>
								<p>Corsairs</p>
							</div>
						</div>
					</div>
				</div>
				<div className='stream-involvement'>
					<div className='stream-involvement__stat'>
						<WatcherIcon/>
						<p>458K</p>
					</div>
					<div className='stream-involvement__stat'>
						<HeartFullIcon/>
						<p>1.2K</p>
					</div>
					<div className='stream-involvement__stat'>
						<SubscribeFullIcon/>
						<p>250</p>
					</div>
				</div>
				<div className={`chat-opener ${['chat-visible', ''].includes(chatVisible) ? 'hide' : ''}`}>
					<button onClick={toggleFullScreen} title='Open Chat'><ChatIcon/></button>
				</div>
			</header>

	);
};

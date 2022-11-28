import React, {useEffect, useState} from 'react';

import AlarmIcon from '../../assets/icons/AlarmIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import ClockIcon from '../../assets/icons/ClockIcon';
import DownVoteIcon from '../../assets/icons/DownVoteIcon';
import HeartFullIcon from '../../assets/icons/HeartFullIcon';
import HeartHollowIcon from '../../assets/icons/HeartHollowIcon';
import SubscribeFullIcon from '../../assets/icons/SubscribeFullIcon';
import SubscribeHollowIcon from '../../assets/icons/SubscribeHollowIcon';
import UpVoteIcon from '../../assets/icons/UpVoteIcon';

const CountDownTimer = () => {
	const [countDown, setCountDown] = useState('00:00:00');
	const [countUp, setCountUp] = useState('00:00:00');

	const start = new Date();
	const deadline = new Date();
	deadline.setHours(start.getHours() + 3);

	const convertMsToTimeString = (ms: number) => {
		let seconds: number | string = Math.floor((ms / 1000) % 60);
		let minutes: number | string = Math.floor((ms / 1000 / 60) % 60);
		let hours: number | string = Math.floor((ms / (1000 * 60 * 60)) % 24);

		if (hours < 10) hours = '0' + hours;
		if (minutes < 10) minutes = '0' + minutes;
		if (seconds < 10) seconds = '0' + seconds;
		return `${hours}:${minutes}:${seconds}`;
	}

	const countTimerUp = () => {
		// @ts-ignore
		setCountUp(convertMsToTimeString(Date.parse(new Date()) - Date.parse(start)));
	};

	const countTimerDown = (endTime: Date) => {
		// @ts-ignore
		setCountDown(convertMsToTimeString(Date.parse(endTime) - Date.parse(new Date())));
	};

	useEffect(() => {
		setInterval(countTimerUp, 1000);
		setInterval(() => countTimerDown(deadline), 1000);
	}, []); // eslint-disable-line

	return (
		<div className='timer-container'>
			<div>
				<p>{countUp}</p>
				<ClockIcon/>
			</div>
			<div>
				<p>-{countDown}</p>
				<AlarmIcon/>
			</div>
		</div>
	)
}

const FollowerButtons = () => {
	const [followed, setFollowed] = useState(false);
	const [subscribed, setSubscribed] = useState(false);
	return (
		<>
			<button
				className='follower-button'
				onClick={() => setFollowed(!followed)}
			>
				{followed ? <HeartFullIcon/> : <HeartHollowIcon/>}
				<p>Follow</p>
			</button>
			<button
				className='follower-button'
				onClick={() => setSubscribed(!subscribed)}
			>
				{subscribed ? <SubscribeFullIcon/> : <SubscribeHollowIcon/>}
				<p>Subscribe</p>
			</button>
		</>
	)
}

const VotingButtons = () => (
	<div className='voting-button-group'>
		<button>
			<UpVoteIcon/>
			<p>325K</p>
		</button>
		<button>
			<DownVoteIcon/>
			<p>9.5K</p>
		</button>
	</div>
);


const StreamerDetails = () => (
	<div className='streamer-details-container'>
		<div className='avatar'/>
		<div className='streamer-container'>
			<div className='streamer-name'>
				<p>PolarBear</p>
				<CheckIcon/>
			</div>
			<ul className='streamer-details'>
				<li>English</li>
				<li>FPS</li>
				<li>Shooter</li>
			</ul>
		</div>
	</div>
);


export const GamingFooter = () => (
	<footer>
		<StreamerDetails/>
		<div className='user-interaction-container'>
			<CountDownTimer/>
			<FollowerButtons/>
			<VotingButtons/>
		</div>
	</footer>
);

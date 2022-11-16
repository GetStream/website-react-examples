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

	let totalSeconds = 0;
	const deadline = new Date();
	deadline.setHours(deadline.getHours() + 3);

	const countTimerUp = () => {
		++totalSeconds;
		let hour: number | string = Math.floor(totalSeconds / 3600);
		let minute: number | string = Math.floor((totalSeconds - hour * 3600) / 60);
		let seconds: number | string = totalSeconds - (hour * 3600 + minute * 60);

		if (hour < 10) hour = '0' + hour;
		if (minute < 10) minute = '0' + minute;
		if (seconds < 10) seconds = '0' + seconds;

		setCountUp(`${hour}:${minute}:${seconds}`);
	};

	const countTimerDown = (endTime: Date) => {
		const total = endTime.getTime() - new Date().getTime();
		const seconds = Math.floor(total % 60);
		const minutes = Math.floor((total / 60) % 60);
		const hours = Math.floor((total / (60 * 60)) % 24);

		setCountDown(`${hours}:${minutes}:${seconds}`);
	};

	useEffect(() => {
		setInterval(countTimerUp, 1000);
		setInterval(() => countTimerDown(deadline), 1000);
	}, []); // eslint-disable-line

	return (
		<div className='timer-container'>
			<div>
				<p>{countDown}</p>
				<ClockIcon/>
			</div>
			<div>
				<p>-{countUp}</p>
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

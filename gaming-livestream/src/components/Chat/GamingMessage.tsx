import React, {MouseEventHandler, useCallback, useMemo, useState} from 'react';
import {Attachment, MessageContextValue, useChannelActionContext, useMessageContext} from 'stream-chat-react';

import {UserIcon} from './UserIcon';
import ActionDownVote from '../../assets/icons/ActionDownVote';
import ActionThread from '../../assets/icons/ActionThread';
import ActionUpVote from '../../assets/icons/ActionUpVote';
import ReactionDownVote from '../../assets/icons/ReactionDownVote';
import ReactionUpVote from '../../assets/icons/ReactionUpVote';
import {getColor} from '../../assets/data';

import {TimestampContextValue, useMessageTimestamp} from "../../context/MessageTimestampController";

import type {StreamMessage} from 'stream-chat-react/dist/context/ChannelStateContext';
import type {StreamChatType} from '../../types';

const getTimeStamp = (messageCreatedAt?: StreamMessage<StreamChatType>['created_at']) => {
	if (!messageCreatedAt) return '';

	const createdAt = new Date(messageCreatedAt);
	let lastHours: number | string = createdAt.getHours();
	let lastMinutes: number | string = createdAt.getMinutes();
	let half = 'AM';

	if (lastHours === undefined || lastMinutes === undefined) {
		return '';
	}

	if (lastHours > 12) {
		lastHours = lastHours - 12;
		half = 'PM';
	}

	if (lastHours === 0) lastHours = 12;
	if (lastHours === 12) half = 'PM';

	if (lastMinutes.toString().length === 1) {
		lastMinutes = `0${lastMinutes}`;
	}

	return `${lastHours}:${lastMinutes} ${half}`;
};

const getReplyButtonText = (reply_count?: number) => {
	if (!reply_count) return '';
	if (reply_count === 1) return '1 reply';
	return `${reply_count} Replies`;
};

type VotingStatsProps = {
	upVotes: number;
	downVotes: number;
}

const VotingStats = ({upVotes, downVotes}: VotingStatsProps) => {
	const hasVotes = upVotes > 0 || downVotes > 0;

	if (!hasVotes) return null;

	return (
		<div className='custom-message__voting-stats'>
			{upVotes > 0 && (
				<>
					<ReactionUpVote/>
					<p>{upVotes}</p>
				</>
			)}
			{downVotes > 0 && (
				<>
					<ReactionDownVote/>
					<p>{downVotes}</p>
				</>
			)}
		</div>
	);
};

type MessageActionsProps = {
	downVote: MouseEventHandler<HTMLButtonElement>;
	upVote: MouseEventHandler<HTMLButtonElement>;
	onOpenThread: MouseEventHandler<HTMLElement>;
}

const MessageActions = ({downVote, upVote, onOpenThread}: MessageActionsProps) => (
	<div className='custom-message__actions-wrapper'>
		<button onClick={upVote}><ActionUpVote/></button>
		<button onClick={downVote}><ActionDownVote/></button>
		<button onClick={onOpenThread}><ActionThread/></button>
	</div>
);

type ReactionListProps = VotingStatsProps
	& Pick<MessageActionsProps, 'onOpenThread'>
	& Pick<StreamMessage<StreamChatType>, 'reply_count'>;

const ReactionList = ({upVotes, downVotes, onOpenThread}: ReactionListProps) => {
	const {message} = useMessageContext<StreamChatType>();
	return (
		<div className='custom-message__reaction-list'>
			<VotingStats upVotes={upVotes} downVotes={downVotes}/>
			{!!message.reply_count && (
				<p onClick={onOpenThread} className='custom-message__reply-count'>
					{getReplyButtonText(message.reply_count)}
				</p>
			)}
		</div>
	);
}

type MessageContentProps = {color?: string}
	& Pick<MessageContextValue<StreamChatType>, 'message' | 'handleAction'>
	& Pick<TimestampContextValue, 'timestampEnabled'>;

const MessageContent = ({color, message, handleAction, timestampEnabled}: MessageContentProps) => {
	return (
		<>
			<div className='custom-message__content'>
				<UserIcon type={message.user?.userRole}/>
				{timestampEnabled && <span className='timestamp'>
            {getTimeStamp(message.created_at)}
          </span>}
				<p className='message-owner' style={{color}}>
					{message.user?.name || message.user?.id || 'Unknown'}
				</p>
				<p className='message'>{message.text}</p>
			</div>
			{!!message?.attachments?.length && (
				<Attachment attachments={message.attachments} actionHandler={handleAction}/>
			)}
		</>
	)
}

export const GamingMessage = () => {
	const {openThread} = useChannelActionContext<StreamChatType>();
	const {handleAction, message} = useMessageContext<StreamChatType>();
	const {timestampEnabled} = useMessageTimestamp();
	const [downVotes, setDownVotes] = useState(0);
	const [upVotes, setUpVotes] = useState(0);

	const onOpenThread: MouseEventHandler<HTMLElement> = useCallback((event) => {
		const chatPanel = document.querySelector<HTMLDivElement>('.str-chat__main-panel');
		if (chatPanel) chatPanel.style.display = 'none';
		openThread(message, event);
	}, [openThread, message]);

	const downVote: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		setDownVotes((prev) => prev + 1)
	}, []);

	const upVote: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		setUpVotes((prev) => prev + 1);
	}, []);

	const color = useMemo(() => {
		return message.user?.color || getColor();
	}, [message?.id]); // eslint-disable-line

	return (
		<div className='custom-message__wrapper'>
			<MessageContent
				color={color}
				message={message}
				handleAction={handleAction}
				timestampEnabled={timestampEnabled}
			/>
			<ReactionList
				downVotes={downVotes}
				upVotes={upVotes}
				onOpenThread={onOpenThread}
				reply_count={message.reply_count}
			/>
			<MessageActions
				downVote={downVote}
				upVote={upVote}
				onOpenThread={onOpenThread}
			/>
		</div>
	);
};

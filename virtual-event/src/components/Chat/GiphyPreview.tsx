import React from 'react';
import {
  Attachment,
  AttachmentActionsProps,
  Card,
  CardProps,
  GiphyPreviewMessageProps,
  useActionHandler,
} from 'stream-chat-react';

import { GiphyCommandIcon, VideoViewersIcon } from '../../assets';
import { StreamChatType } from '../../types';

const CustomAttachmentActions: React.FC<AttachmentActionsProps<StreamChatType>> = (props) => {
  const { actionHandler, actions } = props;

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value?: string,
    name?: string,
  ) => {
    try {
      if (actionHandler) await actionHandler(name, value, event);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='giphy-preview-actions'>
      {actions.map((action, i) => (
        <button
          className='giphy-preview-actions-button'
          key={i}
          onClick={(event) => handleClick(event, action.value, action.name)}
        >
          {action.value}
        </button>
      ))}
    </div>
  );
};

const CustomCard: React.FC<CardProps> = (props) => {
  const { image_url, thumb_url, type } = props;

  const image = thumb_url || image_url;

  if (type === 'giphy') {
    return (
      <div className='giphy-preview-card'>
        <div className='giphy-preview-card-header'>
          <GiphyCommandIcon />
          <span>Giphy</span>
        </div>
        {image && (
          <div className='str-chat__message-attachment-card--header'>
            <img alt={image} src={image} />
          </div>
        )}
      </div>
    );
  }

  return <Card {...props} />;
};

export const GiphyPreview: React.FC<GiphyPreviewMessageProps<StreamChatType>> = (props) => {
  const { message } = props;

  const handleAction = useActionHandler(message);

  if (!message.attachments) return null;

  return (
    <div className='giphy'>
      <div className='giphy-preview'>
        <Attachment<StreamChatType>
          actionHandler={handleAction}
          attachments={message.attachments}
          AttachmentActions={CustomAttachmentActions}
          Card={CustomCard}
        />
      </div>
      <div className='giphy-footer'>
        <VideoViewersIcon />
        <span>Only visible to you</span>
      </div>
    </div>
  );
};

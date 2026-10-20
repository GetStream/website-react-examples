import { useEffect } from 'react';
import type { EventPayload, StreamChat } from 'stream-chat';

const notifyParent = (parent: string) => (message: any) => {
  window.parent.postMessage(message, parent);
};

const YOUTUBE_LINK = 'https://youtu.be/Ujvy-DEA-UM';
const YOUTUBE_LINK_RE = /^(http(s)?:\/\/)?(youtu.be\/Ujvy-DEA-UM\/?)$/;

// We have to keep this task list up-to-date with the website's checklist
const [REACT_TO_MESSAGE, RUN_GIPHY, SEND_YOUTUBE, DRAG_DROP, START_THREAD, SEND_MESSAGE] = [
  'react-to-message',
  'run-giphy',
  'send-youtube',
  'drag-drop-image',
  'start-thread',
  'send-message',
];

export const useChecklist = (chatClient: StreamChat | null, targetOrigin: string) => {
  useEffect(() => {
    const notify = notifyParent(targetOrigin);

    const handleNewMessage = ({ message }: EventPayload<'message.new'>) => {
      if (message && message.command === 'giphy') {
        notify(RUN_GIPHY);
        return;
      }
      if (message && message.attachments && message.attachments.length) {
        const [attachment] = message.attachments;
        if (
          attachment.type === 'video' &&
          (attachment.og_scrape_url === YOUTUBE_LINK ||
            YOUTUBE_LINK_RE.test(attachment.og_scrape_url as string))
        ) {
          notify(SEND_YOUTUBE);
          return;
        }
        if (attachment.type === 'image') {
          notify(DRAG_DROP);
          return;
        }
      }
      if (message && message.parent_id) {
        notify(START_THREAD);
        return;
      }
      notify(SEND_MESSAGE);
    };

    const subscriptions = chatClient
      ? [
          chatClient.on('reaction.new', () => notify(REACT_TO_MESSAGE)),
          chatClient.on('message.new', handleNewMessage),
        ]
      : [];

    return () => subscriptions.forEach(({ unsubscribe }) => unsubscribe());
  }, [chatClient, targetOrigin]);
};

import { useEffect } from 'react';

const notifyParent = (parent) => (message) => {
  window.parent.postMessage(message, parent);
};

// We have to keep this task list up-to-date with the website's checklist
const [RUN_GIPHY, REPLY_MESSAGE, SEND_MESSAGE] = ['run-giphy', 'reply-message', 'send-message'];

export const useChecklist = (chatClient, targetOrigin) => {
  useEffect(() => {
    const notify = notifyParent(targetOrigin);
    const handleNewEvent = ({ type, message }) => {
      switch (type) {
        case 'message.new':
          if (message.command === 'giphy') {
            notify(RUN_GIPHY);
            break;
          }
          if (message.parent_id) {
            notify(REPLY_MESSAGE);
            break;
          }
          notify(SEND_MESSAGE);
          break;
        default:
          break;
      }
    };
    if (chatClient) {
      chatClient.on(handleNewEvent);
    }
    return () => chatClient?.off(handleNewEvent);
  }, [chatClient, targetOrigin]);
};

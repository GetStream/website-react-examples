import { useEffect } from 'react';

const notifyParent = (parent) => (message) => {
  window.parent.postMessage(message, parent);
};

// We have to keep this task list up-to-date with the website's checklist
const [REACT_TO_MESSAGE, RUN_GIPHY, SEND_MESSAGE] = [
  'react-to-message',
  'run-giphy',
  'send-message',
];

export const useChecklist = (chatClient, targetOrigin) => {
  useEffect(() => {
    const notify = notifyParent(targetOrigin);
    const handleNewEvent = ({ type, message }) => {
      switch (type) {
        case 'reaction.new':
          notify(REACT_TO_MESSAGE);
          break;
        case 'message.new':
          if (message.command === 'giphy') {
            notify(RUN_GIPHY);
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

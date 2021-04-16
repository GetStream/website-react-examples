import { useEffect } from 'react';

const notifyParent = (parent) => (message) => {
  window.parent.postMessage(message, parent);
};

// We have to keep this task list up-to-date with the website's checklist
const [SEND_MESSAGE] = ['customer-send-message'];

export const useChecklist = (customerClient, targetOrigin) => {
  useEffect(() => {
    const notify = notifyParent(targetOrigin);
    const handleNewEvent = ({ type }) => {
      switch (type) {
        case 'message.new':
          notify(SEND_MESSAGE);
          break;
        default:
          break;
      }
    };
    if (customerClient) {
      customerClient.on(handleNewEvent);
    }
    return () => customerClient?.off(handleNewEvent);
  }, [customerClient, targetOrigin]);
};

import { useEffect } from 'react';
import { StreamChat, Event } from 'stream-chat';

// Keep this task liks up-to-date with website's checklist
enum Task {
  Reaction = 'react-to-message',
  Giphy = 'run-giphy',
  SendMessage = 'send-message',
}

type UseCheckList = {
  chatClient?: StreamChat;
  targetOrigin?: string;
};

export const useCheckList = ({ chatClient, targetOrigin }: UseCheckList) => {
  useEffect(() => {
    const notifyParent = (message: Task) => {
      if (targetOrigin) {
        window?.parent?.postMessage(message, targetOrigin);
      }
    };
    const handleNewEvent = ({ type, message }: Event) => {
      switch (type) {
        case 'reaction.new':
          notifyParent(Task.Reaction);
          break;
        case 'message.new':
          if (message?.command === 'giphy') {
            notifyParent(Task.Giphy);
            break;
          }
          notifyParent(Task.SendMessage);
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

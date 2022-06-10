import { MessageUIComponentProps, MessageSimple } from 'stream-chat-react';

import './CustomMessage.css';

const CustomMessage = (props: MessageUIComponentProps) => {
  return <MessageSimple {...props} />;
};

export default CustomMessage;

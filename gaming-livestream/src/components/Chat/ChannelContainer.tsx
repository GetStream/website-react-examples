import {GamingThreadHeader} from "./GamingThreadHeader";
import {SearchIndex} from "emoji-mart";
import {MessageTimestampController} from "../../context/MessageTimestampController";
import {GamingChatInner} from "./GamingChatInner";
import {Channel, useChatContext} from "stream-chat-react";
import React, {useEffect} from "react";
import {StreamChatType} from "../../types";


export const ChannelContainer = () => {
  const {channel, client, setActiveChannel} = useChatContext<StreamChatType>();
  useEffect(() => {
    const loadChat = async () => {
      const channel = client.channel('gaming', 'gaming-demo', { name: 'Gaming Demo' });
      await channel.watch();
      setActiveChannel(channel);
    };

    loadChat();
  }, [client]);

  if (!channel) return null;

  return (
    <Channel
      channel={channel}
      ThreadHeader={GamingThreadHeader}
      emojiSearchIndex={SearchIndex}
    >
      <MessageTimestampController>
        <GamingChatInner />
      </MessageTimestampController>
    </Channel>
  );
};
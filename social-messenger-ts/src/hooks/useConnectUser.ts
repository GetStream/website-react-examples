import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

/**
 * A hook which handles the process of connecting/disconnecting a user
 * to the Stream Chat backend.
 *
 * @param apiKey the Stream app API key to use.
 * @param userToConnect the user information.
 * @param userToken the user's token.
 */
export const useConnectUser = (
  apiKey: string,
  userToConnect: { id: string; name?: string; image?: string },
  userToken?: string,
) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  useEffect(() => {
    const connectUser = async () => {
      const client = new StreamChat(apiKey, {
        enableInsights: true,
        enableWSFallback: true,
      });
      await client.connectUser(userToConnect, userToken);
      setChatClient(client);
    };

    connectUser().catch((e) => {
      console.error(`Failed to connect user`, e);
    });

    return () => {
      chatClient?.disconnectUser().catch((e) => {
        console.error(`Failed to disconnect user`, e);
      });
    };
  }, [apiKey, userToken, userToConnect]); // eslint-disable-line react-hooks/exhaustive-deps

  return chatClient;
};

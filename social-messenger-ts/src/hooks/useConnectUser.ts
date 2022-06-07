import { useEffect, useState } from 'react';
import type { StreamChat } from 'stream-chat';

/**
 * A hook which handles the process of connecting/disconnecting a user
 * to the Stream Chat backend.
 *
 * @param chatClient the chat client.
 * @param userToConnect the user information.
 * @param userToken the user's token.
 */
export const useConnectUser = (
  chatClient: StreamChat,
  userToConnect: { id: string; name?: string; image?: string },
  userToken?: string,
) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  useEffect(() => {
    const connectUser = async () => {
      await chatClient.connectUser(userToConnect, userToken);
      setIsUserConnected(true);
    };

    if (!isUserConnected) {
      connectUser().catch((e) => {
        console.error(`Failed to connect user`, e);
      });
    }
    return () => {
      const disconnectUser = async () => {
        await chatClient.disconnectUser();
        setIsUserConnected(false);
      };

      if (isUserConnected) {
        disconnectUser().catch((e) => {
          console.error(`Failed to disconnect user`, e);
        });
      }
    };
  }, [isUserConnected, chatClient, userToConnect, userToken]);

  return isUserConnected;
};

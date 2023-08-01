import { useEffect, useState } from 'react';
import {
  DefaultGenerics,
  ExtendableGenerics,
  OwnUserResponse,
  StreamChat,
  TokenOrProvider,
  UserResponse,
} from 'stream-chat';

/**
 * A hook which handles the process of connecting/disconnecting a user
 * to the Stream Chat backend.
 *
 * @param apiKey the Stream app API key to use.
 * @param userToConnect the user information.
 * @param userTokenOrProvider the user's token.
 */
export const useConnectUser = <SCG extends ExtendableGenerics = DefaultGenerics>(
  apiKey: string,
  userToConnect: OwnUserResponse<SCG> | UserResponse<SCG>,
  userTokenOrProvider: TokenOrProvider,
) => {
  const [chatClient, setChatClient] = useState<StreamChat<SCG> | null>(null);
  useEffect(() => {
    const client = new StreamChat<SCG>(apiKey, {
      enableInsights: true,
      enableWSFallback: true,
    });

    // Under some circumstances, a "connectUser" operation might be interrupted
    // (fast user switching, react strict-mode in dev). With this flag, we control
    // whether a "disconnectUser" operation has been requested before we
    // provide a new StreamChat instance to the consumers of this hook.
    let didUserConnectInterrupt = false;
    const connectUser = client
      .connectUser(userToConnect, userTokenOrProvider)
      .catch((e) => {
        console.error(`Failed to connect user`, e);
      })
      .then(() => {
        if (!didUserConnectInterrupt) {
          setChatClient(client);
        }
      });

    return () => {
      didUserConnectInterrupt = true;
      // there might be a pending "connectUser" operation, wait for it to finish
      // before executing the "disconnectUser" in order to prevent race-conditions.
      connectUser.then(() => {
        setChatClient(null);
        client.disconnectUser().catch((e) => {
          console.error(`Failed to disconnect user`, e);
        });
      });
    };
  }, [apiKey, userTokenOrProvider, userToConnect]);

  return chatClient;
};

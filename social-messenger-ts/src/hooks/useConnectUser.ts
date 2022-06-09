import { useEffect, useRef, useState } from 'react';
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
export const useConnectUser = <StreamChatGenerics extends ExtendableGenerics = DefaultGenerics>(
  apiKey: string,
  userToConnect: OwnUserResponse<StreamChatGenerics> | UserResponse<StreamChatGenerics>,
  userTokenOrProvider: TokenOrProvider,
) => {
  const [chatClient, setChatClient] = useState<StreamChat<StreamChatGenerics> | null>(null);
  const disconnectUserPromiseRef = useRef<Promise<unknown> | null>(null);
  useEffect(() => {
    const client = new StreamChat<StreamChatGenerics>(apiKey, {
      enableInsights: true,
      enableWSFallback: true,
    });

    const wait = disconnectUserPromiseRef.current || Promise.resolve();
    const connectUserPromise = wait.then(() =>
      client
        .connectUser(userToConnect, userTokenOrProvider)
        .catch((e) => {
          console.error(`Failed to connect user`, e);
        })
        .then(() => {
          setChatClient(client);
        }),
    );
    return () => {
      connectUserPromise.then(() => {
        setChatClient(null);
        disconnectUserPromiseRef.current = client.disconnectUser().catch((e) => {
          console.error(`Failed to disconnect user`, e);
        });
      });
    };
  }, [apiKey, userTokenOrProvider, userToConnect]);

  return chatClient;
};

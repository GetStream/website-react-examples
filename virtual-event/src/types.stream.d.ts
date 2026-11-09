import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    // `name` / `image` are declared by stream-chat-react since 15.0.0-rc.4
    demo?: string;
  }

  // stream-chat v10 nests these under `custom`; optional so request and fixture objects can omit them
  interface CustomUserData {
    title?: string;
  }

  interface CustomMessageData {
    up_votes?: string[];
  }

  interface CustomMessageComposerData {
    command: 'giphy' | null;
  }
}
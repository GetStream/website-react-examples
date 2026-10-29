import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
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
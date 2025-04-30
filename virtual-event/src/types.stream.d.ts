import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
    demo?: string;
  }

  interface CustomUserData {
    title: string;
  }

  interface CustomMessageData {
    show_in_channel: boolean;
    up_votes: string[]
  }

  interface CustomMessageComposerData {
    command: 'giphy' | null;
  }
}
import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
    demo?: string;
  }

  // stream-chat 10 types these as `user.custom.*`; optional, because users created elsewhere lack them
  interface CustomUserData {
    title?: string;
  }

  // `show_in_channel` is a built-in message field; only `up_votes` is custom (`message.custom.up_votes`)
  interface CustomMessageData {
    up_votes?: string[];
  }

  interface CustomMessageComposerData {
    command: 'giphy' | null;
  }
}

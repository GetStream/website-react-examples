import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    // `name` / `image` are declared by stream-chat-react since 15.0.0-rc.4
    demo?: string;
  }
}
import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
    demo?: string;
  }
}
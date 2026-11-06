import 'stream-chat';


export type MessageInputFormattingType =  'bold' | 'italics' | 'code' | 'strikethrough';
export type MessageInputControlType = 'emoji' | MessageInputFormattingType;

declare module 'stream-chat' {
  interface CustomChannelData {
    // `name` / `image` are declared by stream-chat-react since 15.0.0-rc.4
    demo?: string;
  }

  interface CustomMessageComposerData {
    command: 'giphy' | null;
    activeFormatting: MessageInputFormattingType | null;
  }
}
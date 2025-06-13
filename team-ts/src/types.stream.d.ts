import 'stream-chat';


export type MessageInputFormattingType =  'bold' | 'italics' | 'code' | 'strikethrough';
export type MessageInputControlType = 'emoji' | MessageInputFormattingType;

declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
    demo?: string;
  }

  interface CustomMessageComposerData {
    command: 'giphy' | null;
    activeFormatting: MessageInputFormattingType | null;
  }
}
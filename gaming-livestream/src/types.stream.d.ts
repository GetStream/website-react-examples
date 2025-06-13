import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    name: string;
  }

  interface CustomUserData {
    color: string;
    userRole: UserRole;
  }
}
import 'stream-chat';
import type { UserRole } from './types';

declare module 'stream-chat' {
  interface CustomChannelData {
    name: string;
  }

  // stream-chat 10 types these as `user.custom.*`; optional, because users created elsewhere lack them
  interface CustomUserData {
    color?: string;
    userRole?: UserRole;
  }
}

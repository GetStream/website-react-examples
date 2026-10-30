import 'stream-chat';
import type { UserRole } from './types';

declare module 'stream-chat' {
  interface CustomChannelData {
    name: string;
  }

  interface CustomUserData {
    color: string;
    userRole: UserRole;
  }
}
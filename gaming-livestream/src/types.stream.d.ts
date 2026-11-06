import 'stream-chat';
import type { UserRole } from './types';

declare module 'stream-chat' {
  // CustomChannelData `name` / `image` are declared by stream-chat-react since 15.0.0-rc.4
  interface CustomUserData {
    color: string;
    userRole: UserRole;
  }
}
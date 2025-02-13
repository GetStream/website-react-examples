import { ReactionOptions } from 'stream-chat-react';
import { DOMAttributes } from 'react';

import {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
  avatar20,
  avatar21,
  avatar22,
  avatar23,
  avatar24,
} from '../../assets';

export const getFormattedTime = (time: number) => {
  if (!time) return '';
  if (time < 60) return 'Less than 1 min';
  if (time < 120) return '1 min';
  if (time < 3600) return `${Math.floor(time / 60)} mins`;
  if (time < 7200) return '1 hour';
  if (time < 86400) return `${Math.floor(time / 3600)} hours`;
  if (time < 172800) return '1 day';
  return `${Math.floor(time / 86400)} days`;
};

type CustomElement<T> = Partial<T & DOMAttributes<T>>;

type EmEmojiProps = {
  id: string;
  shortcodes: string;
  native: string;
  size: string;
  fallback: string;
  set: string;
  skin: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'em-emoji': CustomElement<EmEmojiProps>;
    }
  }
}

export const customReactions: ReactionOptions = [
  {
    type: 'heart',
    name: 'Heavy Red Heart',
    Component: () => <em-emoji id='heart' />,
  },
  {
    type: '+1',
    name: 'Thumbs Up Sign',
    Component: () => <em-emoji id='+1' />,
  },
  {
    type: '-1',
    name: 'Thumbs Down Sign',
    Component: () => <em-emoji id='-1' />,
  },
  {
    type: 'laughing',
    name: 'Smiling Face with Open Mouth and Tightly-Closed Eyes',
    Component: () => <em-emoji id='laughing' />,
  },
  {
    type: 'angry',
    name: 'Angry Face',
    Component: () => <em-emoji id='angry' />,
  },
];

const randomTitles = [
  'Admin',
  'Moderator',
  'Speaker',
  'Software Engineer',
  'Frontend Developer',
  'Mobile Developer',
  'System Architect',
  'Product Manager',
  'Content Designer',
  'Inside Sales',
  'UX/UI Designer',
  'Marketing Manger',
  'Technical Recruiter',
  'Technical Marketing',
  'Content Marketing',
  'Customer Success',
  'Integration Engineer',
  'Sales Engineer',
  'Community Manager',
  'Developer Relations',
  'Accounting',
  'Sales Operations',
];

export const getRandomTitle = () => {
  const index = Math.floor(randomTitles.length * Math.random());
  return randomTitles[index];
};

const randomImages = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
  avatar20,
  avatar21,
  avatar22,
  avatar23,
  avatar24,
];

export const getRandomImage = () => {
  const index = Math.floor(Math.random() * 24);
  return randomImages[index];
};

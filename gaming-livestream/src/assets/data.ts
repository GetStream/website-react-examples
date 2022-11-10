import type { UserRole } from '../types';

export const upgrades = [
  {
    name: 'Unlimited Karma',
    description: 'Subscribe for $3 / month',
    active: true,
    img: 'infinite',
  },
  { name: 'Karma +10', description: 'Activate mobile notifications', active: false, img: 'bell' },
  { name: 'Karma +10', description: 'Allow livestream in AdBlock', active: false, img: 'hand' },
  { name: 'Karma +10', description: 'Be a member for 100 days', active: false, img: 'member' },
];

export const getRandomUserRole = () => {
  const index = Math.random();
  if (index > 0.95) return 'streamer';
  if (index > 0.85) return 'VIP';
  if (index > 0.75) return 'moderator';
  return 'default';
};

const colors = ['#5096ff', '#e60053', '#00ddb5', '#dde100', '#8458ff', '#ffa800'];

export const getColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export type ParticipantMock = {
  name: string; color: string; type: UserRole;
}

export type ParticipantGroup = 'Streamers' | 'Moderators' | 'VIPs' | 'Users' | string;

export type ParticipantsDataSet = Record<ParticipantGroup, ParticipantMock[]>

export const participants = {
  Streamers: [{ name: 'PolarBear', color: '#5096ff', type: 'streamer' }],
  Moderators: [
    { name: 'Nava99', color: '#e60053', type: 'moderator' },
    { name: 'rawr2994', color: '#00ddb5', type: 'moderator' },
    { name: 'FrogPlanetB', color: '#dde100', type: 'moderator' },
    { name: 'Space_Cadet82', color: '#8458ff', type: 'moderator' },
  ],
  VIPs: [
    { name: 'craw85', color: '#5096ff', type: 'VIP' },
    { name: 'kiddwim', color: '#ffa800', type: 'VIP' },
    { name: 'idoltoren', color: '#8458ff', type: 'VIP' },
    { name: 'LLookket1', color: '#e60053', type: 'VIP' },
  ],
  Users: [
    { name: 'funkytallguy', color: '#e60053', type: 'user' },
    { name: 'HalfEntity', color: '#8458ff', type: 'user' },
    { name: 'homelessmango33', color: '#00ddb5', type: 'user' },
    { name: 'JijE34', color: '#ffa800', type: 'user' },
    { name: 'KingAhhRock', color: '#00ddb5', type: 'user' },
    { name: 'KSK999', color: '#dde100', type: 'user' },
    { name: 'Ladyprime91', color: '#ffa800', type: 'user' },
    { name: 'longshot123', color: '#8458ff', type: 'user' },
    { name: 'softpastel', color: '#00ddb5', type: 'user' },
    { name: 'NevRock', color: '#e60053', type: 'user' },
    { name: 'Sol_Invictus', color: '#5096ff', type: 'user' },
    { name: 'xzzeus', color: '#dde100', type: 'user' },
    { name: 'gotchasuckas', color: '#5096ff', type: 'user' },
    { name: 'FunRyder', color: '#00ddb5', type: 'user' },
  ],
};

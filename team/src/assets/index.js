export { AddChannel } from './AddChannel';
export { BoldIcon } from './BoldIcon';
export { ChannelInfo } from './ChannelInfo';
export { CloseCreateChannel } from './CloseCreateChannel';
export { CloseThreadIcon } from './CloseThreadIcon';
export { CodeSnippet } from './CodeSnippet';
export { HashIcon } from './HashIcon';
export { InviteIcon } from './InviteIcon';
export { ItalicsIcon } from './ItalicsIcon';
export { LightningBolt } from './LightningBolt';
export { LightningBoltSmall } from './LightningBoltSmall';
export { PinIcon } from './PinIcon';
export { PinIconSmall } from './PinIconSmall';
export { SearchIcon } from './SearchIcon';
export { SendButton } from './SendButton';
export { SideBarFlag } from './SideBarFlag';
export { SideBarLogo } from './SideBarLogo';
export { SmileyFace } from './SmileyFace';
export { StrikeThroughIcon } from './StrikeThroughIcon';

const randomImages = [
  'https://randomuser.me/api/portraits/women/47.jpg',
  'https://randomuser.me/api/portraits/women/57.jpg',
  'https://randomuser.me/api/portraits/women/50.jpg',
  'https://randomuser.me/api/portraits/women/85.jpg',
  'https://randomuser.me/api/portraits/women/89.jpg',
  'https://randomuser.me/api/portraits/women/51.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/40.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/women/4.jpg',
  'https://randomuser.me/api/portraits/women/64.jpg',
  'https://randomuser.me/api/portraits/men/43.jpg',
  'https://randomuser.me/api/portraits/men/7.jpg',
  'https://randomuser.me/api/portraits/men/82.jpg',
  'https://randomuser.me/api/portraits/men/91.jpg',
  'https://randomuser.me/api/portraits/men/17.jpg',
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/men/26.jpg',
  'https://randomuser.me/api/portraits/men/53.jpg',
  'https://randomuser.me/api/portraits/men/21.jpg',
  'https://randomuser.me/api/portraits/men/77.jpg',
  'https://randomuser.me/api/portraits/men/58.jpg',
  'https://randomuser.me/api/portraits/men/81.jpg',
];

export const getRandomImage = () => {
  const index = Math.floor(Math.random() * 24);
  return randomImages[index];
};

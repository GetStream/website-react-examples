export { ChannelInfoIcon } from './ChannelInfoIcon';
export { ChannelSaveIcon } from './ChannelSaveIcon';
export { CloseThreadIcon } from './CloseThreadIcon';
export { CommandIcon } from './CommandIcon';
export { CreateChannelIcon } from './CreateChannelIcon';
export { EmojiIcon } from './EmojiIcon';
export { HamburgerIcon } from './HamburgerIcon';
export { LightningBoltSmall } from './LightningBoltSmall';
export { SendIcon } from './SendIcon';
export { XButton } from './XButton';
export { XButtonBackground } from './XButtonBackground';

const randomImages = [
  require('./userImages/photo-1438761681033-6461ffad8d80.jpeg'),
  require('./userImages/photo-1463453091185-61582044d556.jpeg'),
  require('./userImages/photo-1503467913725-8484b65b0715.jpeg'),
  require('./userImages/photo-1519345182560-3f2917c472ef.jpeg'),
  require('./userImages/photo-1506089676908-3592f7389d4d.jpeg'),
  require('./userImages/photo-1507003211169-0a1dd7228f2d.jpeg'),
  require('./userImages/photo-1517202383675-eb0a6e27775f.jpeg'),
  require('./userImages/photo-1519345182560-3f2917c472ef.jpeg'),
  require('./userImages/photo-1541271696563-3be2f555fc4e.jpeg'),
  require('./userImages/photo-1542345812-d98b5cd6cf98.jpeg'),
  require('./userImages/photo-1546539782-6fc531453083.jpeg'),
  require('./userImages/photo-1546623381-d6d69cd69955.jpeg'),
  require('./userImages/photo-1546820389-44d77e1f3b31.jpeg'),
  require('./userImages/photo-1548946526-f69e2424cf45.jpeg'),
  require('./userImages/photo-1549351236-caca0f174515.jpeg'),
  require('./userImages/photo-1551069613-1904dbdcda11.jpeg'),
  require('./userImages/photo-1554384645-13eab165c24b.jpeg'),
  require('./userImages/photo-1569443693539-175ea9f007e8.jpeg'),
  require('./userImages/photo-1573140247632-f8fd74997d5c.jpeg'),
  require('./userImages/photo-1546456073-6712f79251bb.jpeg'),
  require('./userImages/photo-1502378735452-bc7d86632805.jpeg'),
  require('./userImages/photo-1546967191-fdfb13ed6b1e.jpeg'),
  require('./userImages/photo-1502937406922-305bb2789e95.jpeg'),
  require('./userImages/photo-1552058544-f2b08422138a.jpeg'),
  require('./userImages/photo-1531251445707-1f000e1e87d0.jpeg'),
];

export const getRandomImage = () => {
  const index = Math.floor(Math.random() * 24);
  return randomImages[index];
};

export const getCleanImage = (member) => {
  if (!member?.user.image) return getRandomImage();

  if (member?.user.image.includes('jen-avatar')) {
    return randomImages[11];
  }

  return member.user.image;
};

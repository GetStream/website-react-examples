import avatar1 from './userImages/photo-1438761681033-6461ffad8d80.jpeg';
import avatar2 from './userImages/photo-1463453091185-61582044d556.jpeg';
import avatar3 from './userImages/photo-1503467913725-8484b65b0715.jpeg';
import avatar4 from './userImages/photo-1519345182560-3f2917c472ef.jpeg';
import avatar5 from './userImages/photo-1506089676908-3592f7389d4d.jpeg';
import avatar6 from './userImages/photo-1507003211169-0a1dd7228f2d.jpeg';
import avatar7 from './userImages/photo-1517202383675-eb0a6e27775f.jpeg';
import avatar8 from './userImages/photo-1531251445707-1f000e1e87d0.jpeg';
import avatar9 from './userImages/photo-1541271696563-3be2f555fc4e.jpeg';
import avatar10 from './userImages/photo-1542345812-d98b5cd6cf98.jpeg';
import avatar11 from './userImages/photo-1546539782-6fc531453083.jpeg';
import avatar12 from './userImages/photo-1546623381-d6d69cd69955.jpeg';
import avatar13 from './userImages/photo-1546820389-44d77e1f3b31.jpeg';
import avatar14 from './userImages/photo-1548946526-f69e2424cf45.jpeg';
import avatar15 from './userImages/photo-1549351236-caca0f174515.jpeg';
import avatar16 from './userImages/photo-1551069613-1904dbdcda11.jpeg';
import avatar17 from './userImages/photo-1554384645-13eab165c24b.jpeg';
import avatar18 from './userImages/photo-1569443693539-175ea9f007e8.jpeg';
import avatar19 from './userImages/photo-1573140247632-f8fd74997d5c.jpeg';
import avatar20 from './userImages/photo-1546456073-6712f79251bb.jpeg';
import avatar21 from './userImages/photo-1502378735452-bc7d86632805.jpeg';
import avatar22 from './userImages/photo-1546967191-fdfb13ed6b1e.jpeg';
import avatar23 from './userImages/photo-1502937406922-305bb2789e95.jpeg';
import avatar24 from './userImages/photo-1552058544-f2b08422138a.jpeg';

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

export const getCleanImage = (member) => {
  let cleanImage = member.user?.image || '';

  const cleanIndex = randomImages.findIndex((image) => image.includes(cleanImage?.slice?.(1, -14)));

  if (cleanIndex === -1) {
    cleanImage = getRandomImage();
  } else {
    cleanImage = randomImages[cleanIndex];
  }

  if (member.user?.name === 'Jen Alexander') {
    cleanImage = randomImages[11];
  }

  if (member.user?.name === 'Kevin Rosen') {
    cleanImage = randomImages[23];
  }

  return cleanImage;
};

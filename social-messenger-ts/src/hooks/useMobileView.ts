import { useCallback, useEffect, useState } from 'react';

/**
 * Internal, handles the mobile/responsive view adjustments.
 */
export const useMobileView = () => {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  useEffect(() => {
    const mobileChannelList = document.querySelector('#mobile-channel-list');
    if (isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.add('show');
      document.body.style.overflow = 'hidden';
    } else if (!isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }, [isMobileNavVisible]);

  return useCallback(() => {
    setIsMobileNavVisible((isMobile) => !isMobile);
  }, []);
};

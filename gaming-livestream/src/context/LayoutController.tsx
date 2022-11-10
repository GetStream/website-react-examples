import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

const noop = () => null;

type LayoutControllerContext = {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  hideChat: () => void;
  popUpText: string;
  publishAppNotification: (text?: string | null) => void;
  memberListVisible: boolean;
  hideMemberList: () => void;
  showMemberList: () => void;
  showUpgrade: boolean;
  showUpgradePopup: () => void;
  hideUpgradePopup: () => void;
}

const LayoutController = createContext<LayoutControllerContext>({
  isFullScreen: false,
  toggleFullScreen: noop,
  hideChat: noop,
  popUpText: '',
  publishAppNotification: noop,
  memberListVisible: false,
  hideMemberList: noop,
  showMemberList: noop,
  showUpgrade: false,
  showUpgradePopup: noop,
  hideUpgradePopup: noop,
});

export const LayoutControlProvider = ({children}: {children: ReactNode}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [popUpText, setPopUpText] = useState('');
  const [memberListVisible, setShowMembers] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const hideChat = useCallback(() => {
    setIsFullScreen(true);
    setShowMembers(false);
  }, []);

  const showUpgradePopup = useCallback(()=> {
    setShowMembers(false);
    setShowUpgrade(true);
  }, []);

  const hideUpgradePopup = useCallback(()=> {
    setShowUpgrade(false);
  }, []);

  const hideMemberList = useCallback(() => {
    setShowMembers(false);
  }, []);

  const showMemberList = useCallback(() => {
    setShowMembers(true);
  }, []);


  const publishAppNotification = useCallback((text?: string | null) => {
    if (!text) return;

    setPopUpText(text);
    setTimeout(() => {
      setPopUpText('');
    }, 3000);

  }, []);

  return <LayoutController.Provider value={{
    isFullScreen,
    hideChat,
    toggleFullScreen,
    popUpText,
    publishAppNotification,
    memberListVisible,
    hideMemberList,
    showMemberList,
    showUpgrade,
    showUpgradePopup,
    hideUpgradePopup,
  }}>{children}</LayoutController.Provider>;
}

export const useLayoutController = () => useContext(LayoutController);
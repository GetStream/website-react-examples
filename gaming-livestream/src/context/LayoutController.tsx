import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

const noop = () => null;

export type LayoutControllerContext = {
  chatVisible: 'chat-visible' | 'chat-hidden' | string;
  toggleFullScreen: () => void;
  hideChat: () => void;
  popUpText: string;
  publishAppNotification: (text?: string | null) => void;
  memberListVisible: 'show-members' | 'hide-members' | string;
  hideMemberList: () => void;
  showMemberList: () => void;
  showUpgrade: boolean;
  showUpgradePopup: () => void;
  hideUpgradePopup: () => void;
}

const LayoutController = createContext<LayoutControllerContext>({
  chatVisible: '',
  toggleFullScreen: noop,
  hideChat: noop,
  popUpText: '',
  publishAppNotification: noop,
  memberListVisible: '',
  hideMemberList: noop,
  showMemberList: noop,
  showUpgrade: false,
  showUpgradePopup: noop,
  hideUpgradePopup: noop,
});

export const LayoutControlProvider = ({children}: {children: ReactNode}) => {
  const [chatVisible, setChatVisibility] = useState<LayoutControllerContext['chatVisible']>('');
  const [popUpText, setPopUpText] = useState('');
  const [memberListVisible, setShowMembers] = useState<LayoutControllerContext['memberListVisible']>('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  console.log('chatVisible', chatVisible)
  const toggleFullScreen = useCallback(() => {
    setChatVisibility((prev) => ['chat-hidden', ''].includes(prev) ? 'chat-visible' : 'chat-hidden');
  }, []);

  const hideChat = useCallback(() => {
    setChatVisibility('chat-hidden');
    setShowMembers('hide-members');
  }, []);

  const showUpgradePopup = useCallback(()=> {
    setShowMembers('hide-members');
    setShowUpgrade(true);
  }, []);

  const hideUpgradePopup = useCallback(()=> {
    setShowUpgrade(false);
  }, []);

  const hideMemberList = useCallback(() => {
    setShowMembers('hide-members');
  }, []);

  const showMemberList = useCallback(() => {
    setShowMembers('show-members');
  }, []);


  const publishAppNotification = useCallback((text?: string | null) => {
    if (!text) return;

    setPopUpText(text);
    setTimeout(() => {
      setPopUpText('');
    }, 3000);

  }, []);

  return <LayoutController.Provider value={{
    chatVisible,
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
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
  upgradePanelVisible: boolean;
  showUpgradePanel: () => void;
  hideUpgradePanel: () => void;
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
  upgradePanelVisible: false,
  showUpgradePanel: noop,
  hideUpgradePanel: noop,
});

export const LayoutControlProvider = ({children}: {children: ReactNode}) => {
  const [chatVisible, setChatVisibility] = useState<LayoutControllerContext['chatVisible']>('');
  const [popUpText, setPopUpText] = useState('');
  const [memberListVisible, setShowMembers] = useState<LayoutControllerContext['memberListVisible']>('');
  const [upgradePanelVisible, setUpgradePanelVisible] = useState(false);

  const toggleFullScreen = useCallback(() => {
    setChatVisibility((prev) => ['chat-hidden', ''].includes(prev) ? 'chat-visible' : 'chat-hidden');
    setShowMembers('');
  }, []);

  const hideChat = useCallback(() => {
    setChatVisibility('chat-hidden');
    setShowMembers('hide-members');
  }, []);

  const showUpgradePanel = useCallback(()=> {
    setShowMembers('hide-members');
    setUpgradePanelVisible(true);
  }, []);

  const hideUpgradePanel = useCallback(()=> {
    setUpgradePanelVisible(false);
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
    upgradePanelVisible,
    showUpgradePanel,
    hideUpgradePanel,
  }}>{children}</LayoutController.Provider>;
}

export const useLayoutController = () => useContext(LayoutController);
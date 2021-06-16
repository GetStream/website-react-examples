import ThreadBackIcon from '../../assets/icons/ThreadBackIcon';

export const GamingThreadHeader = ({ closeThread, thread }) => {
  const onCloseThread = (event) => {
    const chatPanel = document.querySelector('.str-chat__main-panel');
    chatPanel.style.display = 'flex';
    closeThread(event);
  };

  const getReplyCount = () => {
    if (!thread?.reply_count) return 0;
    return thread.reply_count;
  };

  return (
    <div className='thread-header__wrapper' onClick={onCloseThread}>
      <ThreadBackIcon {...{ onCloseThread }} />
      <p>{`Thread (${getReplyCount()})`}</p>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { useMessageInputContext } from 'stream-chat-react';
import Picker from '@emoji-mart/react';

import { StreamChatType } from '../../types';
import { MessageInputControlButton } from './MessageInputControls';

// similar to EmojiPicker from "stream-chat-react/emojis"
// but with custom wrappers and button
export const EmojiPicker = () => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
  const { insertText, textareaRef } = useMessageInputContext<StreamChatType>();

  useEffect(() => {
    if (!popperElement || !referenceElement) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (popperElement.contains(target) || referenceElement.contains(target)) return;

      setEmojiPickerIsOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [referenceElement, popperElement]);

  return (
    <>
      {emojiPickerIsOpen && (
        <div
          className='str-chat__message-textarea-emoji-picker-container'
          style={styles.popper}
          {...attributes.popper}
          ref={setPopperElement}
        >
          <Picker
            theme='light'
            data={async () => (await import('@emoji-mart/data')).default}
            onEmojiSelect={(e: { native: string }) => {
              insertText(e.native);
              textareaRef.current?.focus();
            }}
          />
        </div>
      )}
      <MessageInputControlButton
        type='emoji'
        onClick={() => setEmojiPickerIsOpen((open) => !open)}
        ref={setReferenceElement}
      />
    </>
  );
};

import {useCallback, useMemo} from 'react';
import {useChannelStateContext, useChatContext, useMessageComposer, useMessageInputContext} from 'stream-chat-react';
import type {MessageInputFormattingType} from "../../../types.stream";

const mdToFormattingType: Record<string, MessageInputFormattingType> = {
  '**': 'bold',
  '*': 'italics',
  '~~': 'strikethrough',
  '``': 'code',
}

export const formattingTypeToMarkdown: Record<MessageInputFormattingType, string> = {
  bold: '**',
  code: '`',
  italics: '*',
  strikethrough: '~~',
}

export const useMessageInputCompositionControls = () => {
  const { client } = useChatContext();
  const {
    channel,
  } = useChannelStateContext();
  const {customDataManager, textComposer} = useMessageComposer();
  const {textareaRef} = useMessageInputContext();
  const placeholder = useMemo(() => {
    let dynamicPart = 'the group';

    if (channel.type === 'team') {
      dynamicPart = `#${channel?.data?.name || channel?.data?.id || 'random'}`;

    }

    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    if (!members.length || members.length === 1) {
      dynamicPart = members[0]?.user?.name || members[0]?.user?.id || 'Johnny Blaze';

    }

    return `Message ${dynamicPart}`;

  }, [channel.type, channel.state.members, channel?.data?.id, channel?.data?.name, client.userID]);

  const handleFormattingButtonClick = useCallback((wrappingMarkdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const {activeFormatting} = customDataManager.customComposerData;
    if (!activeFormatting) {
      textComposer.wrapSelection({head: wrappingMarkdown, tail: wrappingMarkdown});
      customDataManager.setCustomData({activeFormatting: mdToFormattingType[wrappingMarkdown]});
      textarea.selectionStart = textComposer.selection.start;
      textarea.selectionEnd = textComposer.selection.end;
      textarea.focus();
      return;
    }
    const activeMarkdown = formattingTypeToMarkdown[activeFormatting];
    const newSelection = {
      start: textComposer.selection.start + activeMarkdown.length,
      end: textComposer.selection.end + + activeMarkdown.length,
    };
    textarea.selectionStart = newSelection.start;
    textarea.selectionEnd = newSelection.end;
    if (wrappingMarkdown === activeMarkdown) {
      customDataManager.setCustomData({activeFormatting: null});
    } else {
      customDataManager.setCustomData({activeFormatting: mdToFormattingType[wrappingMarkdown]});
      textComposer.wrapSelection({head: wrappingMarkdown, selection: newSelection, tail: wrappingMarkdown});
    }
    textarea.focus();
  }, [customDataManager, textareaRef, textComposer])

  const formatter = useMemo<Record<MessageInputFormattingType, () => void>>(() => ({
    bold: () => handleFormattingButtonClick('**'),
    italics: () => handleFormattingButtonClick('*'),
    'strikethrough': () => handleFormattingButtonClick('~~'),
    code: () => handleFormattingButtonClick('`'),
  }), [handleFormattingButtonClick]);

  return {
    formatter,
    placeholder,
  }
}
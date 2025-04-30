import {CommandSuggestion, MessageComposer, TextComposerMiddlewareParams, UserSuggestion} from "stream-chat";

export const createGiphyCommandControlMiddleware = (composer: MessageComposer) => {
  const trigger = '/giphy ';
  return ({
    id: 'demo-team/text-composer/giphy-command-control',
    onChange: ({input, nextHandler}: TextComposerMiddlewareParams<UserSuggestion>) => {
      const {attachmentManager} = composer;
      const hasNonUploadAttachments = attachmentManager.attachments.filter((att) => !att.localMetadata.uploadState).length > 0;
      const hasUploadAttachments = attachmentManager.uploadsInProgressCount + attachmentManager.successfulUploadsCount > 0;
      if (hasUploadAttachments || hasNonUploadAttachments) {
        return nextHandler(input);
      }

      const {customDataManager} = composer;
      if (!input.state.text && customDataManager.customComposerData.command) {
        customDataManager.setCustomData({command: null})
        return nextHandler(input);
      }
      if (!input.state.text.startsWith(trigger) || customDataManager.customComposerData.command) {
        return nextHandler(input);
      }

      customDataManager.setCustomData({command: 'giphy'});
      const newText = input.state.text.slice(trigger.length);
      return nextHandler({
        ...input,
        state: {
          ...input.state,
          text: newText,
          selection: {start: input.state.selection.start - trigger.length, end: input.state.selection.end - trigger.length},
        }
      });
    },
    onSuggestionItemSelect: ({
      input,
      nextHandler,
      selectedSuggestion,
    }: TextComposerMiddlewareParams<CommandSuggestion>) => {
      if (selectedSuggestion?.name !== 'giphy')
        return nextHandler(input);

      composer.customDataManager.setCustomData({command: 'giphy'});
      const newText = input.state.text.slice(trigger.length);
      return nextHandler({
        ...input,
        state: {
          ...input.state,
          text: newText,
          selection: {start: input.state.selection.start - trigger.length, end: input.state.selection.end - trigger.length},
        }
      });
    }
  });
};
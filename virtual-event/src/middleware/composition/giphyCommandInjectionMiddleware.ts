import {
  MessageComposer, MessageComposerMiddlewareState,
  type MessageDraftComposerMiddlewareValueState,
  MiddlewareHandlerParams
} from "stream-chat";

export const createGiphyCommandInjectionMiddleware = (composer: MessageComposer) => ({
  id: 'demo-virtual-event/message-composer-middleware/giphy-command-injection',
  handlers: {
    compose: ({
                forward,
                next,
                state,
              }: MiddlewareHandlerParams<MessageComposerMiddlewareState>) => {
      const {custom: {command}} = composer.customDataManager.state.getLatestValue();
      const {attachments, text} = state.localMessage;
      const injection = command && `/${command}`;
      if (command !== 'giphy' || !injection || text?.startsWith(injection) || attachments?.length) return forward();
      const enrichedText = `${injection} ${text}`
      return next({
        ...state,
        localMessage: {
          ...state.localMessage,
          text: enrichedText,
        },
        message: {
          ...state.message,
          text: enrichedText,
        },
      });
    }
  }
});
export const createDraftGiphyCommandInjectionMiddleware = (composer: MessageComposer) => ({
  id: 'demo-team/message-composer-middleware/draft-giphy-command-injection',
  handlers: {
    compose: ({
                forward,
                next,
                state,
              }: MiddlewareHandlerParams<MessageDraftComposerMiddlewareValueState>) => {
      const {custom: {command}} = composer.customDataManager.state.getLatestValue();
      const text = state.draft.text;
      const injection = command && `/${command}`;
      if (command !== 'giphy' || !injection || text?.startsWith(injection)) return forward();
      const enrichedText = `${injection} ${text}`
      return next({
        ...state,
        draft: {
          ...state.draft,
          text: enrichedText,
        },
      });
    }
  }

});
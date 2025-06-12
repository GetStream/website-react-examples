import {MessageComposer, MiddlewareHandlerParams, TextComposerMiddlewareExecutorState} from "stream-chat";
import {formattingTypeToMarkdown} from "../../components/TeamMessageInput/hooks/useMessageInputCompositionControls";


export const createFormattingMarkdownInjectionMiddleware = (composer: MessageComposer) => {
  return ({
    id: 'demo-team/text-composer/formatting-markdown-injection',
    handlers: {
      onChange: ({forward, next, state}: MiddlewareHandlerParams<TextComposerMiddlewareExecutorState>) => {
        const formattingMarkdown = composer.customDataManager.customComposerData.activeFormatting;
        if (!formattingMarkdown) return forward();
        const markdown = formattingTypeToMarkdown[formattingMarkdown];
        if (state.text.length || !markdown) return forward();

        return next({
            ...state,
            text: `${markdown}${state.text}${markdown}`,
            selection: {start: markdown.length, end: markdown.length + state.text.length},
        });
      },
      onSuggestionItemSelect: ({ forward }: MiddlewareHandlerParams<TextComposerMiddlewareExecutorState>) => forward(),
    }
  });
};
# stream-chat-react v14 → v15.0.0-rc.3 migration log

Apps: `social-messenger-ts` (uses `ChatView`) and `team-ts` (custom layout, no `ChatView`).
Installed: `stream-chat-react@15.0.0-rc.3`, `stream-chat@10.0.0-rc.26`.

Guides tested:

- React: [`ai-migration-v14-v15.md`](https://github.com/GetStream/stream-chat-react/blob/master/ai-docs/ai-migration-v14-v15.md) (master)
- JS: [`v10-breaking-changes.md`](https://github.com/GetStream/stream-chat-js/blob/release-v10/ai-docs/v10-breaking-changes.md) (release-v10)

Severity:

- **gap**: not covered; I had to read SDK source or types.
- **inaccurate**: the guide doesn't match rc.3.
- **friction**: covered, but hard to find or apply.
- **nit**: minor.
- **good**: the guide caught something I would otherwise have missed. Recorded so the strong parts survive edits.

## Summary

Typecheck went from ~30 errors (social-messenger) and ~75 errors (team-ts) to zero. Every compile error had an answer in one of the two guides. Both apps pass `CI=true yarn build` and were exercised in the browser against the staging app, side by side with a v14 baseline built from `master`.

The real gaps are in UI states that compile fine but behave differently, mostly around `ChatView` views remounting, plus a few type-level holes. The most important is gap 1: the guide's own `useOpenFirstChannel` snippet breaks view switching inside `ChatView`.

Smaller bundles: with v15, gzipped `main.js` shrank from 775 → 678 kB (social-messenger) and 798 → 663 kB (team-ts).

## Gaps worth fixing

1. **`useOpenFirstChannel` + `ChatView` views = the channel resets on every view switch.** **gap, highest impact**. `ChatView` unmounts the inactive view, so a sidebar inside `views.channels` remounts each time the user returns from Threads.
   - The §6 `useOpenFirstChannel` snippet guards with a `useRef`. The ref resets on remount, so the hook calls `openChannel(first)` again and overrides the slot state that "each view keeps … when you switch between them" (§3). In practice: open Alice → Threads → Channels, and the first channel is shown instead.
   - The §6 sidebar example builds the `ChannelPaginator` inside the component that renders the list, so the paginator is also re-created and re-queried on every switch.
   - v14 kept the active channel in `ChatContext`, so this worked there.
   - Fix used here, worth putting in the guide: create and register the paginator once, above `ChatView`. Guard the auto-open with `useWorkspaceNavigation().openChannels.length === 0` rather than a ref.
2. **`ResizeObserver loop completed with undelivered notifications` on every load.** **SDK issue, not a guide gap**. Under CRA's dev server this becomes a full-screen "Uncaught runtime errors" overlay that blocks clicks.
    - Seen on 3 of 3 loads of social-messenger and on team-ts. Not seen with the v14 baseline under the same conditions.
    - team-ts has no `ChatView` / `SlotGeometry`, so the source is a shared component; the candidates are the `MessageList` relayout observer and `InfiniteScrollPaginator`'s new resize check (§11). I couldn't isolate it: the browser pane was hidden for part of the session, which pauses ResizeObserver delivery.
    - It's harmless in production, but every CRA / webpack-dev-server user will see it.
3. **App CSS that uses removed classes *in combinators*.** **friction**. §19 lists the removed classes, but social-messenger also had `.messaging-create-channel + .str-chat__main-panel { display: none }` (and a `:not(:last-child)` header rule) in component CSS files. Without them, the "create chat" panel rendered *beside* the channel instead of replacing it. I only caught it by comparing against v14. A ready-to-run grep in §19 (`grep -rnE "str-chat__(main-panel|container|channel-list-inner|thread--virtualized)" --include="*.css" --include="*.scss"`) would catch these.

4. **`channel.state.typing` is `Record<string, Event>`.** **gap** (React §9 + SDK types). The `TypingCount` example in React §9 only calls `Object.keys(typing)`. Any real typing indicator reads `event.user`, and that no longer compiles: `Event` is now a discriminated union and `user` is not on every member. Both apps' indicators needed a type guard, `(e): e is EventPayload<'typing.start'> => e.type === 'typing.start'`. Two fixes:
   - Guide: show the narrowing.
   - SDK (better): type the slice as `Record<string, EventPayload<'typing.start'>>`.
5. **Stale-state bug from "no remount per channel".** **good**, but easy to miss. React §5 says `Channel` no longer remounts children per channel. social-messenger's header seeded `useState(channel.data?.name)`, so after a channel switch it kept showing the previous channel's name. Nothing fails at compile time. The §5 bullet is abstract; a concrete "`useState(initialFromChannel)` goes stale" example would make it land. It belongs in the silent-break table too: the table has "mount effects stop re-running" but not "state seeded from the channel goes stale".
6. **"Without `ChatView`" omits `isThreadDismissable`.** **gap** (React §4). The `WorkspaceNavigationProvider` example overrides `openChannel`, `isChannelActive`, `openChannels`, `openThread`, `closeThread`, `openThreads` and `isThreadActive`. Per §8, the default `ThreadHeader` close button renders only when `isThreadDismissable(id)` is true. With the example as written, a default `ThreadHeader` has no close button. The minimum override list should include `isThreadDismissable`, plus `isChannelDismissable`, `canGoBack` and `goBack` if the default headers are used.
7. **TypeScript suggests the wrong slot for `ThreadHeader`.** **friction**. A stale `ThreadHeader` override fails with `TS2561 ... Did you mean to write 'ThreadHead'?`. `ThreadHead` is the *parent message* slot, so following the compiler's hint renders the header as the thread's first message. React §7/§10 explain the removal; one line warning about this hint would prevent a plausible wrong fix.
8. **Custom message UIs that read `getMessageActions()`.** **inaccurate (tone)**. React §10 says the `messageActions` prop "had already stopped working in v14: `getMessageActions` was written into `MessageContext` and read by nothing". That is true of the SDK's own UI, but a custom `MessageUI` could and did read it: team-ts gated its reply and react buttons on `getMessageActions()` + `MESSAGE_ACTIONS`. The guide does give the fix (`useUserRole(message).canReply/canReact`) further down. The lead-in suggests there is nothing to do, so it should open with "if your custom message UI calls `getMessageActions()`…".
9. **`useCloseThread()` event type.** **nit**. It takes `{ event?: WorkspaceNavigationTriggerEvent }`, which is `React.MouseEvent | KeyboardEvent | TouchEvent`. A v14 close button typed `(e: React.BaseSyntheticEvent) => void` (the v14 `closeThread` type) no longer fits. React §7 says to "pass the event as `{ event }`" but not that the type narrowed.
10. **i18n keys for app strings that were never SDK keys.** **friction**. team-ts called `t('Message Failed · Click to try again')`. That string is not in the v14 `en.json` or the key map, so the map lookup finds nothing. The answer, `asDynamicKey`, is in §18, but the flow ("look up the key map; if absent, the string was app-owned, use `asDynamicKey`") isn't spelled out.
11. **`setMessageComposerSetupFunction` is deprecated.** **nit**. It's covered in the JS guide (§2) but absent from the React guide. Nearly every React app calls it (it's the documented recipe for emoji or giphy middleware), so it deserves a one-liner in React §13 pointing at `client.config.setSetupFunction('messageComposer', …)`.

## Log, in order

### Install (both apps)

- **inaccurate**: React §1 says the `stream-chat` peer is `^10.0.0-rc.20`. rc.3 declares `^10.0.0-rc.25`; the latest `rc` tag is `10.0.0-rc.26`. Suggest "the version the installed `package.json` peer declares" instead of a literal.
- **good**: React §1's Node 22 note. social-messenger's `.nvmrc` was `v16` and the deploy workflow used `node-version: 18`. Both bumped to 22. The CI job also builds `gaming-livestream` and `virtual-event` (still on v14 / v9), which now build on Node 22 too.
- `@stream-io/state-store` deduped to one copy (1.1.6), and `dayjs` to one copy.
- **nit, not a regression**: CRA prints 134 "Failed to parse source map" warnings for `dist/css/*.css` (the `.map` files reference `src/**/*.scss`, which isn't shipped). v14's CSS has the same `sourceMappingURL`, so this isn't new.

### social-messenger-ts

| Break (tsc) | Where the fix was | Notes |
| --- | --- | --- |
| `ChannelSort` not exported from `stream-chat` | JS §5 sort, rename table | **friction**: the React guide's removed-exports table lists only React exports. A `stream-chat` type import is usually the first error an app sees. A pointer ("`ChannelSort`, `UserSort`, … → `SortParamRequest[]`, see JS §5") would help. |
| `ChatView` not exported | React §1, §3 | **good**. The full channels + threads example mapped almost 1:1 onto the app. |
| `'timestamp/MessageTimestamp'` not in `TranslationDictionary` | React §18 + key map JSON | Found `timestamp.MessageTimestamp` in the key map. Typing the dictionary is what surfaced it, as the guide promises. |
| `ThreadHeader` override key | React §7/§10 | See gap 7 (`Did you mean 'ThreadHead'?`). |
| `<Channel>` needs `channel`; `<Thread virtualized />` | React §3, §5, §7 | Moved to `ChannelSlot` / `ThreadSlot` and a `slotRenderers.thread`. Rendered `VirtualizedMessageList` in the thread myself. |
| `Window` removed; `messageActions` prop | React §3, §10 | `messageActions` was a no-op already, so I dropped it. |
| `useChatContext().setActiveChannel` / `.channel` | React §2, §4, §6 | `openChannel` + the `active` prop on `ChannelListItemUI`. I checked the source to confirm a custom `ChannelListItemUI` receives the computed `active` (it does). The guide implies it ("defaults to `isChannelActive`") without saying it's passed to the UI. |
| `client.channel('messaging', { members: string[] })` | React §5 (members-only) | **good**: the "render the instance `watch()` resolves with" snippet is exactly this app's create-DM flow. |
| `useChannelStateContext` | React §9 | `useChannel()` + `useStateStore(channel.state, ...)`. |
| `channel.update({ name }, { text })` | JS §6 `update` | **good**: the exact v9 → v10 mapping, including "spread `custom`". |
| `channel.data?.name` | React §17, JS §5 | Read `data.custom.name`. |
| `channel.state.last_message_at` | JS §7 (`messagePaginator.latestMessageAt`) | Not in the React guide. Here I used `previewedMessage.created_at` instead, which is already a prop. |
| `latestMessagePreview` prop | React §6 | `SummarizedMessagePreview`. |
| `ChannelList filters/sort/options` | React §6 | `ChannelPaginator` + `insertPaginator`. `options.limit` → `paginatorOptions.pageSize`. |
| filter key `demo` | JS §5 filters | `'custom.demo'`. |
| `ThreadHeaderProps.closeThread/thread` | React §7 | `useThreadContext` + `useCloseThread`; reply count from `thread.state.replyCount`. See gap 9. |
| `useTypingContext` | React §9 | See gap 4. |
| `Event.message` in a `client.on` handler | JS §5 Event union | v14 code destructured `{ message, type }` before narrowing. Narrowing must come first: `switch (event.type) { case 'message.new': event.message }`. |
| `UserResponse.privacy_settings` | React §2 (`userData` is `ClientUser`) | Retyped as `ClientUser`. |

Behavior changes applied from the silent-break table:

- Opened the first channel on load (`setActiveChannelOnMount` default). The `useOpenFirstChannel` snippet worked as-is.
- Replaced the thread composer's v14 `autoFocus` default with `<MessageComposer focus />`.
- Moved panel sizing to `.str-chat__chat-view__slot[data-slot='channel-thread']` (React §19). Removed the `.str-chat__main-panel` / `--thread-open` rules.
- Fixed the header-name stale state (gap 5).

### team-ts

| Break (tsc) | Where the fix was | Notes |
| --- | --- | --- |
| `StreamChat.getInstance(key, { enableInsights, enableWSFallback })` | JS §2 + option table | **good**: the example in JS §2 is literally `enableWSFallback`. `enableInsights` is listed as removed. |
| No `ChatView`: needed my own navigation | React §4 "Without ChatView" | **good**, with gap 6. Put `activeChannel` / `activeThread` in the app's existing `WorkspaceController`, which also fixes the admin panel (it read `ChatContext.channel` while `<Channel>` was unmounted). |
| `ChannelListUI` / `ChannelListUIProps` | React §6 list slots | The app's `ChannelListUI` was a section *wrapper* (title, "+" button, loading and error states), not a list renderer. The slots don't cover a wrapper. The answer is to render the wrapper around `<ChannelList>` and use `useChannelPaginatorState(paginator).lastQueryError` and `FirstPageLoadingIndicator`. **friction**: the guide's replacement example only covers the "custom list container" shape. |
| `channelRenderFilterFn` by type | React §6 | Dropped. With strict paginator filters (`allowNewMessagesFromUnfilteredChannels` gone) the per-type filter is redundant. The guide doesn't say so, but it follows from §6. |
| two lists, one opens first, one `setActiveChannelOnMount={false}` | React §6 | Applied `useOpenFirstChannel` to the team list only. |
| `Message: TeamMessage` override | React §10 | `MessageUI`; TS suggested the right name here. |
| `<Thread additionalMessageComposerProps>` | React §7 | Composed children; kept v14 defaults with `withDateSeparator={false}` and `focus`. |
| `Window`; thread and pins beside the channel | React §3, §19 | `.channel__container` became `display: flex`. Thread and pins render as siblings of `<Channel>`. |
| `PinnedMessageList` read `channel.state.pinnedMessages` and `<Message Message={...}>` | JS §7 `pinnedMessagesPaginator`, React §12 standalone `Message` | **good**: `ChannelInstanceProvider` was exactly what a pins panel rendered beside the channel needs. |
| `useChannelActionContext().closeThread(event)` | React §9 | `useWorkspaceNavigation().closeThread()`. |
| `useChannelStateContext().watcher_count` | React §9 | `watcherCount` slice. |
| `MESSAGE_ACTIONS`, `getMessageActions` | React §10 | See gap 8. |
| `useMessageContext('MessageTeam')`, `useTranslationContext('MessageTeam')` | React §10 | Dropped the argument. |
| `TranslationLanguages` type | JS rename table | `message.i18n` is `Record<string, string>` now, so no cast is needed. |
| `t('Only visible to you')`, `t('aria/Open Reaction Selector')`, `t('Edit Message')` | React §18 key map | Mapped. See gap 10 for the app-owned strings. |
| `handleSubmit` from composer context | React §13 | `useMessageComposerSubmitFn()`. |
| `client.channel(type, id, { name, members, demo })` | React §5 input shape, JS §3 | `{ custom: { name, demo }, members: [{ user_id }] }`. |
| `channel.addMembers(ids)` | React §17, JS §6 | `addMembers({ members })`. |
| `client.queryUsers(filter, sort, options)` | JS §3 generated signatures | `queryUsers({ payload: { filter_conditions, sort, limit } })`. The old `// @ts-ignore` on `$nin` is gone; `$nin` now type-checks. |
| `client.queryChannels(...)` returns an object | JS §3 | **good**: "same name, different return type" is called out explicitly. → `queryChannelsAndHydrate`. |
| Custom search result opens a channel | React §4 search results | Called `channel.watch()` before `openChannel` as advised. |

### Runtime verification (staging, user `v15-tester`, v14 baseline from `master` side by side)

social-messenger-ts (`ChatView`):

- The first channel opens on load, and switching channels updates the header (name from `custom.name`).
- The active row is highlighted via the `active` prop.
- A thread from "N replies" opens beside the channel (~330px slot) with the custom header and a focused composer; close works.
- In the Threads view, selecting a thread opens it.
- Threads → Channels keeps the open channel (after the gap 1 fix).
- Create-DM with an existing member resolves to the existing channel and opens it. The panel replaces the channel (after the gap 3 fix).
- No navigation warnings in the console.

team-ts (custom `WorkspaceNavigationProvider`):

- Both list sections render with their own paginators, and `#general` opens on load.
- Switching to `#random` updates the header, watcher count and composer placeholder.
- The thread icon opens the thread beside the channel (`.channel__container` is a flex row); the composer focuses and the close button works.
- "Pins" closes the thread and shows the pinned list (`pinnedMessagesPaginator`, one message rendered through `ChannelInstanceProvider` + `TeamMessage`).
- The admin "edit" panel pre-fills the name from `custom.name`. Returning from it keeps the channel picked from search.
- Search returns channels (`queryChannelsAndHydrate`) and users (`queryUsers({ payload })`).

Not exercised: mobile breakpoints, sending a message that fails, the admin "create channel" submit (it would create data on staging), and drag-and-drop uploads.

Environment noise, not SDK: the first `UserSearchSource` query timed out at axios's 3 s default on staging and succeeded on retry.

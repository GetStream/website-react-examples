# stream-chat-react v14 → v15.0.0-rc.2 migration log

Four demo apps (`social-messenger-ts`, `team-ts`, `gaming-livestream`, `virtual-event`) were upgraded from `stream-chat-react@14.13.2` + `stream-chat@9.54` to `stream-chat-react@15.0.0-rc.2` + `stream-chat@10.0.0-rc.22`. These guides were followed:

- React: [`ai-migration-v14-v15.md` @ 0a88ad8](https://github.com/GetStream/stream-chat-react/blob/0a88ad866f33649d1c952c175bfdd1962f21fb0e/ai-docs/ai-migration-v14-v15.md)
- JS: [`v10-breaking-changes.md` @ 7934c61](https://github.com/GetStream/stream-chat-js/blob/7934c610e9e4cad40617aa41ee9080b019e74bd7/ai-docs/v10-breaking-changes.md)

All four apps typecheck, build in CRA's CI mode, and were exercised live against the staging app (user `v15-tester`, data seeded with `stream-chat@10` scripts). Where behavior looked suspicious, it was compared against the unmodified v14 app running side by side.

Each entry is tagged:

- **GAP**: the guides do not cover it, or cover it wrongly.
- **UNCLEAR**: the guides mention it, but it was hard to find or to act on.
- **OK**: the guides covered it well. Listed only where worth noting.

## Summary

The guides are strong on compile-time breaks. Nearly every TypeScript error across the four apps (35 + 76 + 27 + 43) mapped to a guide section, often with a near copy-paste fix. The "Without `ChatView`" `WorkspaceNavigationProvider` snippet worked on the first try. The JS guide's per-entry v9 → v10 → migrate format made the `stream-chat` changes mechanical.

What slipped is mostly runtime and layout behavior, plus one factual error and one missing server-side prerequisite:

| # | Finding | Kind | Where it bit |
| - | ------- | ---- | ------------ |
| 1 | User mute and flag only exist as v2 moderation endpoints in v10 (`client.moderation.mute` / `unmuteUser` / `flagUser` / `flagMessage`). On the staging app every one fails with "this endpoint needs a feature flag, contact support to get it enabled". v15's **default** Mute and Flag message actions call the same endpoints, so they break with no app code change. Neither guide mentions the requirement. | GAP (runtime, high) | virtual-event; every app using default message actions |
| 2 | The React guide says `enableWSFallback`, `wsUrlParams`, `recoverStateOnReconnect` and `isLocalUnreadCountEnabled` "have no `client` key". All four exist (`client.wsConnection.enableWSFallback`, `client.wsConnection.urlParams`, `client.connectionRecovery.enabled`, `channel.readEvents.localUnreadCountEnabled`), and the JS guide maps them correctly. An agent following the React guide drops WS fallback. | GAP (wrong) | team-ts `App.tsx` |
| 3 | v14 `ChannelList` defaulted `setActiveChannelOnMount = true`. v15 opens nothing on load, silently. It's missing from the silent-break table. | GAP | social-messenger-ts, team-ts |
| 4 | Layout CSS: v14's `.str-chat__channel` was the flex **row** holding `Window` + `Thread`. In v15 it's a column, and a sibling `<Thread>` stacks *below* the channel unless the app's container becomes a row. Inside `ChatView`, v14 sizing rules on `.str-chat__thread` now apply inside `flex: 1 1 0` slots and crush the panel. | GAP | all four apps (team-ts, gaming-livestream and virtual-event without `ChatView`) |
| 5 | A custom `MessageUI` that gated its own react/reply buttons on `getMessageActions()` has no stated replacement. `useUserRole(message).canReact / .canReply` works. | GAP | team-ts `TeamMessage` |
| 6 | `queryChannelsAndHydrate(request)` without `stateOptions` is typed as the `withResponse: true` overload (`QueryChannelsResponseWithChannels`), but returns `Channel[]` at runtime. The JS guide's own example hits this. The SDK passes `{ withResponse: false }` internally to avoid it. | SDK typing bug | team-ts search |
| 7 | The linked docs (`i18n-v15-key-map.json`, `i18n-v15-migration.md`, `instance-configuration.md`, `examples/vite/...`) are relative links that don't ship in npm. The guide says to verify against installed packages, so an agent in a consumer repo can't reach them. | GAP | i18n keys, ChatView |
| 8 | Rebuilding a channels + threads `ChatView`: the threads half and the slot-assignment rules are only "see examples/vite". I had to read `dist/es` to learn where an opened entity lands. | UNCLEAR | social-messenger-ts |
| 9 | Channel `name` (and `image`) now live under `custom` on responses, but `name` stays a top-level *filter* key. Neither guide calls out the most common read, `channel.data.name`. | UNCLEAR | all four apps |
| 10 | The Node `>=22.18` engine requirement (Yarn 1 hard-fails) is only in the JS guide. The React guide's install step should repeat it, since CI is the first thing to break. | UNCLEAR | `deploy.yml`, `.nvmrc` |
| 11 | `ChannelList.options.limit` → `paginatorOptions.pageSize` isn't stated; the guide says "check the installed stream-chat". | UNCLEAR | social-messenger-ts, team-ts, virtual-event |
| 12 | Partial updates of custom fields: `updateMessagePartial({ id }, { set: { custom: { up_votes } } })` is rejected ("field `custom` is reserved"). `set: { 'custom.up_votes': ... }` (or the bare key) works. The guides' "custom data goes under `custom`" rule is wrong for partial updates, and `set` is typed `Record<string, any>`, so nothing catches it. | GAP | virtual-event Q&A upvotes |
| 13 | Built-in fields that an app had also declared in a `Custom*Data` augmentation (here `show_in_channel`) must *not* move under `custom`. Following "move every augmented field under `custom`" literally breaks them. | UNCLEAR | virtual-event |
| 14 | `client.on('message.new', h)` narrows `h`, but `client.off('message.new', h)` takes the un-narrowed `EventHandler` and rejects it. The guide recommends narrowed handlers without mentioning this; use the `{ unsubscribe }` that `on()` returns. | SDK typing | virtual-event |

Suggested fixes, in order of value:

- Call out the v2 moderation feature flag (1) in both guides, and in v15's own release notes for the default Mute/Flag actions.
- Fix the wrong "no `client` key" sentence (2).
- Add (3) and (4) to "Breaks that do not fail to compile".
- Make all links absolute and pinned (7).
- Add a channels + threads `ChatView` example with a paragraph on slot targeting (8).
- Add one-row mappings for (5), (9), (11), (12) and (13).
- Fix the `queryChannelsAndHydrate` overload (6) and the `client.off` handler type (14).

## Log (chronological)

### Install

- **UNCLEAR: Node engine.** `stream-chat@10` declares `engines.node >=22.18.0`, and Yarn 1 refuses to install on older Node. The JS guide covers this ([node-engine](https://github.com/GetStream/stream-chat-js/blob/7934c610e9e4cad40617aa41ee9080b019e74bd7/ai-docs/v10-breaking-changes.md#node-engine)). The React guide's "Packages" section only says "install `stream-chat@^10`" and doesn't mention it. In this repo both `social-messenger-ts/.nvmrc` (v16) and `.github/workflows/deploy.yml` (`node-version: 18`) break; both are bumped to 22. The React guide should repeat it, because it's the first thing to fail in CI.
- **OK:** `@stream-io/state-store` and `dayjs` each resolved to a single copy with Yarn 1, so the dedupe checks passed.
- **OK (worth a line):** CRA's `moduleResolution: "node"` (node10) resolves `stream-chat-react/slot-layout` types through `typesVersions`, and CRA 5 / webpack 5 bundles v15 without config changes. Neither guide says that legacy resolution is supported.
- **GAP: linked docs and examples don't ship.** The React guide links `./i18n-v15-migration.md`, `./i18n-v15-key-map.json`, `./instance-configuration.md`, `examples/vite/src/...` and `examples/tutorial/...` as relative paths. None of them is in the npm package, but the guide's "Source of truth" tells the agent to work from installed packages. An agent in a consumer repo can't follow those links. They should be absolute GitHub URLs pinned to the release tag.

### social-messenger-ts

Initial `tsc` gave 35 errors across 11 files. Grouped:

- **OK:** `Window` removed, `Channel.channel` required, `Thread.thread` required, `ThreadHeader` slot removed, `useChannelStateContext` / `useTypingContext` removed, `setActiveChannel` / `ChatContext.channel` removed, `ChannelList` → `paginator`. Each compile error mapped to a guide section without guessing.
- **OK:** `ChannelSort` → `SortParamRequest[]`, `Event` union (`client.on('message.new', ...)` narrows), `UserResponse` → `ClientUser` for the connecting user (`privacy_settings`), and `channel.update({ name }, { text })` → `channel.update({ data: { custom: { name } }, message: { text } })`. The last one appears in the JS guide verbatim.
- **OK:** `messageActions={[...]}` on `MessageList`. The guide says the prop already did nothing in v14, so deleting it keeps behavior. That explanation helped.
- **GAP: v14 auto-selected the first channel; v15 does not.** v14's `ChannelList` defaulted `setActiveChannelOnMount` to `true` (confirmed in the 14.13.2 bundle), so apps that never passed it opened the first channel on load. The guide lists the prop under "removed `ChannelListProps`" with "open a channel through workspace navigation". Because it was the default, every app that relied on it silently loads with nothing selected. This belongs in the silent-break table with a snippet (subscribe to `paginator.state`, `openChannel(items[0])` once; see `useOpenFirstChannel` in both apps).
- **UNCLEAR: `ChannelList.options.limit`.** The guide says page size and request options "map onto `ChannelPaginator`'s `requestOptions` / `paginatorOptions`; check the installed `stream-chat`". `ChannelPaginatorRequestOptions` omits `limit`, and the actual home is `paginatorOptions.pageSize`. A table row would be enough: `options.limit` → `paginatorOptions.pageSize`, the rest → `requestOptions`.
- **UNCLEAR: channel `name` / `image` are custom data now.** Reads move to `channel.data.custom.name`, but `name` stays a top-level filter key (`ChannelFilters.name` exists, while `demo` must become `'custom.demo'`). The JS guide shows `{ custom: { name } }` on writes. Neither guide says that `name` (which most apps treat as built-in) is custom on reads, or that `channel.data?.name` is the pattern to grep for. Expect this in nearly every channel header or preview.
- **UNCLEAR: rebuilding a two-view `ChatView`.** The v15 example covers a channels view only. For threads it says "declared the same way ... `examples/vite/src/ChatLayout/Panels.tsx` is the reference", and that file isn't shipped. Facts I had to get from reading `dist/es`:
  - how `openChannel` / `openThread` pick a slot: same kind first, then first free non-persistent slot, then any free slot, then last non-persistent
  - that the `channel` kind is pinned to the `channels` view, so opening a channel from the threads view switches views
  - that `<Slot slot>` with `children` replaces the `slotRenderers` output
  - that `ThreadSlot` hides its slot while empty (`hideIfEmpty`)
  - how to keep UI that used to live inside `<Channel>` but must show with no channel (here, the "create channel" panel): `ChannelSlot`'s `fallback` plus `ChannelPlaceholder`

  A second worked example with channels + threads views, and a short "where does an opened entity land" paragraph, would have saved most of the source reading.
- **OK:** "No remount per channel" caught a real bug. `MessagingChannelHeader` seeded `useState(channel.data?.name)`, which would keep the previous channel's name after switching. The guide flags this both in section 5 and in the silent-break table.
- **UNCLEAR: i18n key rename.** The strict `TranslationDictionary` type caught the stale `'timestamp/MessageTimestamp'` (TS2353), which is good. The key map that says it is now `'timestamp.MessageTimestamp'` isn't shipped (see above), so I found it by grepping `dist`.
- **OK:** The `ThreadHeader` override became a child of `<Thread>` using `useThreadContext()` + `useCloseThread()`. v14's `thread.reply_count` maps to `thread.state.replyCount`.
- **OK:** `ChannelListItemUIProps.latestMessagePreview` → `<SummarizedMessagePreview latestMessage={previewedMessage} />`. `channel.state.last_message_at` → `channel.messagePaginator.lastMessageAt` (JS guide table).

After these changes, `tsc` is clean and `react-scripts build` compiles.

#### social-messenger-ts: live run

Verified in the browser: list + previews + timestamps, auto-opening the first channel, the group name from `custom.name`, sending (the list re-sorts and the preview updates), mark-read, opening a thread from the reply count, the custom thread header with live reply count, closing the thread, the Threads view (list → virtualized thread, active row), switching views (each view keeps its slot state), creating a DM (`channelManager.ensure` + `ensureWatched` + `ingestChannel` + `openChannel`), renaming through `channel.update({ data: { custom } })`, and the header resetting when switching channels.

- **OK (confirmed on the wire):** a `stream-chat@10` client creating a channel with `{ custom: { name } }` gets back `channel.custom.name` with no top-level `name`. Reads must use `channel.data.custom.name`.
- **GAP: CSS for `ChatView` slots.** After v15, the thread panel rendered as a ~120px column with text wrapping per character. App CSS written for v14 (`.str-chat__chat-view__channels .str-chat__thread { flex: 0 1 330px; max-width: 45% }`) now applies *inside* a `section.str-chat__chat-view__slot`, which is `flex: 1 1 0`. So the 45% cap is taken of the slot and compounds. The guide's CSS table covers `str-chat__main-panel` and the view wrappers, but not that sizing rules on `.str-chat__thread` / `.str-chat__channel` must move to the slot (`[data-slot=...]`), or that slots are `flex: 1 1 0` siblings by default. One row ("panel sizing → target `.str-chat__chat-view__slot[data-slot]`") plus the default slot CSS would cover it.
- **Note:** v14's `Thread` defaulted `autoFocus = true` (confirmed in 14.13.2). The guide's "Defaults changed" paragraph covers it (pass `focus`), but the props table row `autoFocus → <MessageComposer focus />` reads as if only apps that *passed* `autoFocus` are affected. Every v14 thread autofocused.
- **Not regressions (checked against 14.13.2):** the thread head renders its own `DateSeparator` regardless of `withDateSeparator`, and a live incoming message gets an extra date separator flagged `unread` before it. v14 did both.

### team-ts

Initial `tsc` gave 76 errors. This app doesn't use `ChatView`: it has its own layout, two channel lists, custom search, an admin panel, a pinned-messages panel, and custom message UI and composer.

- **OK: the "Without `ChatView`" path.** The `WorkspaceNavigationProvider` + `defaultWorkspaceNavigation` snippet in section 4 dropped into the app's existing `WorkspaceController` and worked on the first try (list selection, active rows, reply buttons, `useCloseThread`).
- **GAP (factual error): client options.** Section 2 says "`device`, `disableCache`, `enableInsights`, `enableWSFallback`, `isLocalUnreadCountEnabled`, `logger`, `recoverStateOnReconnect`, `warmUp` and `wsUrlParams` have no `client` key". Four of these have one:

  | v9 option | v10 location |
  | --- | --- |
  | `enableWSFallback` | `client.wsConnection.enableWSFallback` |
  | `wsUrlParams` | `client.wsConnection.urlParams` |
  | `recoverStateOnReconnect` | `client.connectionRecovery.enabled` |
  | `isLocalUnreadCountEnabled` | `channel.readEvents.localUnreadCountEnabled` |

  Checked against the installed `.d.ts`. The JS guide's option table is right. This app passes `enableWSFallback: true`, so following the React guide would silently drop long-poll fallback.
- **OK:** `enableInsights` removed (JS guide), `client.queryUsers(filter, sort, opts)` → `queryUsers({ payload: { filter_conditions, sort, limit } })`, `client.queryChannels` → `queryChannelsAndHydrate`, `channel.state.pinnedMessages` → `channel.pinnedMessagesPaginator`. These come from the JS guide tables.
- **SDK BUG: `queryChannelsAndHydrate` overloads.** The first overload is `(options?, stateOptions?: ChannelStateOptions & { withResponse: true }, ...) => Promise<QueryChannelsResponseWithChannels>`. Because `stateOptions` is optional there, `queryChannelsAndHydrate({ filter_conditions })` resolves to it, but the runtime returns `Channel[]`. The JS guide's own migration example (`await client.queryChannelsAndHydrate({ filter_conditions: ..., sort, limit: 20 })`) is mistyped as a result. `ChannelPaginator` itself passes `{ withResponse: false }` to sidestep it. The fix is to make `stateOptions` required in the first overload.
- **GAP: custom message UI gating.** `TeamMessage` used `getMessageActions()` + `MESSAGE_ACTIONS` to decide whether to render its own reaction and reply buttons. The guide covers `messageActions` / `MessageActions` sets and says "there is no `actionsEnabled` replacement", but not this case. The replacement is `useUserRole(message)`, which exposes `canReact`, `canReply`, `canPin`, and so on. One sentence would cover it.
- **UNCLEAR: app-facing i18n keys.** The app called `t('Only visible to you')`, `t('aria/Open Reaction Selector')`, `t('Edit Message')` and two "Message Failed · …" strings. Without the (unshipped) key map I found `attachment.visibilityDisclaimer.onlyVisible.text`, `common.openReactionSelector.ariaLabel` and `common.editMessage.text` by grepping `t('key', 'default')` calls in `dist`. The two "Message Failed" strings have no v15 key and became `asDynamicKey` app strings. The guide's "rename every key" advice assumes the map is reachable.
- **GAP: layout row (no `ChatView`).** v14 rendered `<Channel><Window/><Thread/></Channel>`, and `.str-chat__channel` was the flex *row* putting the thread beside the channel. The guide says to render `<Thread>` as a sibling and that `.str-chat__channel` "is now the flex column `Window` used to provide". It doesn't say that the row is gone and the app's own container must provide it. In the live run, the thread and the pins panel rendered *below* the channel, pushing the page into a scroll, until `.channel__container` got `display: flex`.
- **OK:** a standalone `<Message>` (the pinned-messages panel, rendered outside `<Channel>`) needs `ChannelInstanceProvider` (section 12), and `Message={TeamMessage}` → a `MessageUI` override. Both worked as described.
- **OK:** `handleSubmit` → `useMessageComposerSubmitFn()` for both custom composers. `ChannelListUI` → `useChannelPaginatorState(paginator)` for the list wrapper's loading and error states, plus the `EmptyListIndicator` slot.
- **Note: `channel.update({ data })` replaces custom data.** The JS guide's mapping `update({ data: { custom: { name } } })` is faithful to v9 (where `update({ name })` also overwrote). In this app it would have wiped `custom.demo` and dropped the renamed channel out of the filtered list. That was a latent v14 bug here too. A one-line warning (spread the existing `custom`, or use `updatePartial`) would help, since the migration is a natural moment to notice it.

#### team-ts: live run

Verified: both lists (team + DMs) with auto-open of the first team channel, the header (`custom.name`, watcher count), sending via the custom send button, custom message actions (react, reply, dropdown), opening a thread from the message, the custom thread composer with autofocus and replies, live reply counts, closing the thread, pinning (pin indicator plus the Pins panel via `pinnedMessagesPaginator`), search (channels by `name` autocomplete, users), opening a search result, creating a DM from a user result, creating a team channel from the admin panel (ingested into the list and opened), renaming via the admin panel (stays in the filtered list), and realtime messages into the open channel and a background channel (unread count).

- **Observation (dev only, worth a note):** after a hot reload re-ran the app's module-level `connectUser`, the old `App` cleanup's `disconnectUser()` disposed the channels. Fast Refresh kept the stale `Channel` instance in `WorkspaceController` state, and `MessageList` threw "Channel … is pending disposal and cannot be used" on render (white screen). v9 also threw from `getClient()` after a disconnect, so this isn't new. But the section 4 snippet keeps channels in app state, so a sentence on dropping held channels on `disconnectUser` (or re-`ensure`-ing them) would save confusion on logout or user switch.
- **Unverified:** after an admin-panel rename, the header's watcher count showed 0 until reload. Every event carrying `watcher_count` overwrites the count (v9 had the same handler), so it most likely reflects what the server sent on the rename events. Not investigated further.

### gaming-livestream

Initial `tsc`: 27 errors. A single livestream channel with a custom message UI, a custom composer, and a thread that *replaces* the channel.

- **OK: `overrideSubmitHandler` → `sendMessageRequest`.** The section 13 recipe worked as written. The app's handler only published an in-app notification for `/ban`, `/mute` and similar, then sent. It became `client.config.set({ channel: { requestHandlers: { sendMessageRequest } } })` calling `defaultRequest(params)`. Verified live: the "User muted" notification still fires.
- **UNCLEAR: registering handlers from a component.** "Registration is per client" is clear, but there's no word on unregistering, or on handlers that need React state. Here the handler needs a function from React context, so it closes over a ref. A short "register in an effect; read React state through a ref; how to remove it" note would help.
- **OK: custom user fields.** `CustomUserData { color, userRole }` → `user.custom.color`; `connectUser({ id, custom: { ... } })`.
- **OK (compile-time):** `new Date(message.created_at).getHours()` failed via the global `DateConstructor` guard (`ERROR_use_SDKs_nsToDate_helper_instead`) → `convertTimestampToDate`.
- **GAP: imperative DOM queries on removed classes.** The app hid the channel while a thread was open with `document.querySelector('.str-chat__main-panel').style.display = 'none'`. That silently matches nothing in v15. The guide's "grep for removed classes" advice is framed around CSS; it should say "CSS *and* JS selectors". Replaced with state: the channel wrapper gets `hidden` while a thread is open.
- **GAP (layout, same family as summary #4):** the v14 thread CSS was `position: absolute`, positioned relative to v14's channel container. As a sibling of `Channel` in v15, the autofocused thread composer scrolled the whole page 338px sideways. v14, run side by side, didn't scroll. Fixed by letting the thread flow in place of the hidden channel.
- **Environment, not v15:** `gaming` channels can't be created by users on the staging app, so the live run temporarily used a `livestream` stand-in channel (reverted).

### virtual-event

Initial `tsc`: 43 errors. Several `livestream` channels plus DMs, a Q&A tab with upvotes, a custom message UI, participant search, and moderation actions.

- **GAP (high, runtime): moderation needs a feature flag.** `client.muteUser` / `unmuteUser` / `flagUser` → `client.moderation.mute({ target_ids })` / `.unmuteUser(id)` / `.flagUser(id)`, exactly per the JS guide table. All three fail on the staging app with "this endpoint needs a feature flag, contact support to get it enabled". There's no non-v2 user mute left in `stream-chat@10` (only `muteChannel`). v15's default message actions (`useMuteHandler`, `useFlagHandler`) call the same endpoints, so **every app's default Mute/Flag action stops working** on apps without the flag. The app's own UI showed "User successfully muted" because it swallows errors; the server confirmed no mute was stored.
- **GAP: partial updates of custom fields.** The Q&A upvote used `client.updateMessage({ ...message, up_votes })`. In v10 the natural rewrite, `updateMessagePartial({ id }, { set: { custom: { up_votes } } })`, is rejected by the API ("field `custom` is reserved and cannot be updated"). Probed against staging: `set: { 'custom.up_votes': [...] }` and `set: { up_votes: [...] }` both work and land in `message.custom.up_votes`. Neither guide says how to address custom fields in `set` / `unset`, and the parameter is untyped.
- **UNCLEAR: built-in fields declared as custom.** The app's v9 augmentation listed `show_in_channel` in `CustomMessageData`, though it's a built-in message field (`MessageResponse.show_in_channel`). The guide's rule "move every read/write of augmented fields under `.custom`" would break it. The guide should say to check each augmented key against the generated response type first.
- **UNCLEAR: silent date break through `isDate`.** `isDate(message.created_at) ? (Date.now() - created_at.getTime()) : 0` compiles in v10 (`isDate` takes `unknown`). It silently returns `false` for nanosecond numbers, so every message would read "Less than 1 min" forever. The guide's not-caught list covers date libraries and `new Date(ts ?? ...)`, but a type-guard branch is a third pattern worth listing. Fixed with `nsToMs`.
- **SDK typing: `client.off(type, handler)`.** After annotating handlers as `EventPayload<'message.new'>` (as the guide recommends), `client.off('message.new', handler)` fails to type-check: `off` takes the un-narrowed `EventHandler`. The returned `{ unsubscribe }` from `client.on(...)` is the clean replacement and worth a mention.
- **OK:** `channel.search` removed (JS guide) → `client.getMessage({ id })` + `formatMessage` to open a show-in-channel reply's parent thread. `CommandResponse` → `Command`. `client.queryUsers` → `{ payload }`. `ChannelListUI` → `useChannelPaginatorState` for the DM list's skeleton and error states. `ChannelList.EmptyStateIndicator` → the `EmptyListIndicator` slot.
- **OK:** "No remount per channel". v14 closed an open thread whenever the user switched event channels, because `Channel` remounted. In v15 the app's thread state resets on `channel` change explicitly.
- **i18n:** `t('Search')` has no v15 key (only `common.search.ariaLabel`), so it became an `asDynamicKey` app string.

#### gaming-livestream and virtual-event: live run

- **gaming-livestream:** messages with custom user colors, sending via the custom send button, the `sendMessageRequest` hook (notification), opening a thread from the custom message action (the channel is hidden and the thread takes its place, with no page scroll, matching v14), thread reply, live reply count, closing the thread.
- **virtual-event:** global channel with live messages, `custom.title` badges, "Show in thread" for a show-in-channel reply (parent fetched with `getMessage`), thread reply and close (position identical to v14), Q&A upvote toggle via `updateMessagePartial` with `'custom.up_votes'` (on the user's own question; upvoting others' messages hits a staging permission 403, which v14's `updateMessage` would hit too), DM list from a `ChannelPaginator` with empty state, participant search and profile, creating a DM (ingested into the list), sending in it, a reply arriving live with the list preview updated, and mute via the header menu (fails server-side, see above).

### SDK nits spotted on the way

- `ChannelList` calls `paginator.next`, which the guide calls deprecated (`toTail()` is the replacement).
- `ChannelListItemProps.channel`'s doc comment still points to the removed `channelRenderFilterFn` / `usePaginatedChannels`.

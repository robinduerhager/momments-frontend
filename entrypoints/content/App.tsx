import '@webcomponents/custom-elements';
import { Show } from "solid-js";
import { mommentsStore, discussions, setDiscussions, user, setMommentsStore } from '$/store';
import { ActivationButton, SettingsButton, Discussion, DiscussionProxy, AddDiscussionButton, MommentsCanvas } from '$/components';
import { DiscussionService } from '$/services';

function App() {
  let discussionsFetchIntervalHandler: NodeJS.Timeout | undefined

  onMount(async () => {
    const hideRemoteCursorStyle = document.createElement('style')
    // Hide any comment and discussion related elements from Soundtrap
    hideRemoteCursorStyle.innerHTML = `
    .discussionstab, .comment-anchor, .timeline-add-discussion-thread-button, ul[role=menu]>li:nth-child(4) {
      display: none !important;
    }
    `
    
    document.head.appendChild(hideRemoteCursorStyle)
    // Request Audio Device Access on App load
    await navigator.mediaDevices.getUserMedia({ audio: true })

    // Immediately set the first audio input device as the default, so the app doesn't crash
    const devices = await navigator.mediaDevices.enumerateDevices()
    setMommentsStore('audioInputDevice', devices.filter(device => device.kind === 'audioinput')[0])

    discussionsFetchIntervalHandler = setInterval(async () => {
      if (user.token) {
        if (!discussions.list.length) {
          // Init fetch
          const dbDiscussions = await DiscussionService.getDiscussions()
          setDiscussions('list', dbDiscussions)
        } else {

          // Props that can change: readBy
          // discussions can be found and updated by their ID
          // if the discussion is not found, it is added to the list
          const dbDiscussions = await DiscussionService.getDiscussions()

          // create a list of discussions that are new to the store
          const newDiscussions = dbDiscussions.filter(
            dbDisc => !discussions.list.some(disc => disc.id === dbDisc.id)
          );

          // append the new Discussions to the store
          // Necessary, so not all discussions (and popovers) get rerendered
          if (newDiscussions.length > 0) {
            for (const newDiscussion of newDiscussions) {
              setDiscussions('list', discussions.list.length, newDiscussion)
            }
          }

          // For the awareness feature, we have to update the readBy property of every discussion
          // If we set a new array of discussions, the popovers will rerender as well

          // First get all (from the db marked) now unread Discussions
          const unreadDiscussions = dbDiscussions.filter(dbDisc => !dbDisc.readBy)
          const updateableReadDiscussionIndices: number[] = []

          // Find the indices of the now unread discussions in the local discussion store
          // and keep an index array of the discussions which should be now marked by the awareness feature
          for (const unreadDiscussion of unreadDiscussions) {
            const idx = discussions.list.findIndex((discussion) => discussion.id === unreadDiscussion.id)
            if (idx !== -1)
              updateableReadDiscussionIndices.push(idx)
          }

          // apply the readBy update so the awareness feature will be shown
          if (updateableReadDiscussionIndices.length > 0) {
            setDiscussions('list', updateableReadDiscussionIndices, 'readBy', false)
          }
        }
      }
    }, 1000 * 60) // 1 Minute delay for updating the locally stored discussions
  })

//   const blockKeydown = (event: KeyboardEvent) => {
//     event.stopPropagation();
//     event.stopImmediatePropagation();
// }

  // createEffect(() => {
  //   if (mommentsStore.appActive) {
  //     document.addEventListener('keydown', blockKeydown, true)
  //     window.addEventListener('keydown', blockKeydown, true)
  //   } else {
  //     document.removeEventListener('keydown', blockKeydown, true)
  //     window.removeEventListener('keydown', blockKeydown, true)
  //   }
  // })

  createEffect(async () => {
    // Init fetch on Login (so the users don't have to wait a minute to see any discussions)
    if (user.token) {
      const dbDiscussions = await DiscussionService.getDiscussions()
      setDiscussions('list', dbDiscussions)
    }
  })

  onCleanup(() => {
    clearInterval(discussionsFetchIntervalHandler)
  })

  return (
    <>
      {/* <div ref={emojiref}></div> */}
      {/* <EmojiPicker data={data} /> */}
      {/* Momments Comments Canvas */}
      <Show when={mommentsStore.appActive}>
        {/* Blocks interaction with the website below */}
        <MommentsCanvas />
        <For each={discussions.list}>
          {(discussion) => {
            return (
              <Discussion discussion={discussion} />
            )
          }}
        </For>
      </Show>

      {/* Momments Activator Button */}
      <div class='absolute bottom-10 w-full justify-center flex gap-5 items-center' style={`pointer-events: none;`}>
        <SettingsButton />
        <Show when={mommentsStore.appActive}>
          <AddDiscussionButton />
        </Show>
        <Show when={mommentsStore.user.token}>
          <ActivationButton />
        </Show>
      </div>

      <Show when={mommentsStore.placeNewDiscussionMode} >
        <DiscussionProxy />
      </Show>
    </>
  );
}

export default App;

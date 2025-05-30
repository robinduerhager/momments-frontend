import '@webcomponents/custom-elements';  // Important polyfill for using custom webcomponents, like emoji-mart in Browserextensions
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

    // Request mediaDevices access and immediately set the first audio input device as the default, so the app won't crash
    const devices = await navigator.mediaDevices.enumerateDevices()
    setMommentsStore('audioInputDevice', devices.filter(device => device.kind === 'audioinput')[0])

    // Interval for refetching the discussions and updating their readBy property for the awarenesspoint
    discussionsFetchIntervalHandler = setInterval(async () => {
      // If the user is logged in
      if (user.token) {
        // Init fetch
        if (!discussions.list.length) {
          const dbDiscussions = await DiscussionService.getDiscussions()
          setDiscussions('list', dbDiscussions)
          // 
        } else {
          // Props that can change: readBy
          // discussions can be found and updated by their ID
          // if the discussion is not found, it is added to the list
          const dbDiscussions = await DiscussionService.getDiscussions()

          // filter the dbDiscussions to find those that are not already in the store, e.g. were created between this and the last fetch
          const newDiscussions = dbDiscussions.filter(
            dbDisc => !discussions.list.some(disc => disc.id === dbDisc.id)
          );

          // append the new Discussions to the store
          // we can't set the array to a new array and therefore have to update more granular.
          // Setting to a new array would lead to a rerender of all discussions and their popovers (which would look like the App closes the popovers all the time)
          if (newDiscussions.length > 0) {
            for (const newDiscussion of newDiscussions) {
              setDiscussions('list', discussions.list.length, newDiscussion)
            }
          }

          // For the awareness feature, we have to update the readBy property of every discussion
          // First get all by the user unread discussions (e.g. new discussions and those with new content)
          const unreadDiscussions = dbDiscussions.filter(dbDisc => !dbDisc.readBy)
          const updateableReadDiscussionIndices: number[] = []

          // Find the indices of the now unread discussions in the local discussion store (using an indices array will lead to a better update performance according to solidjs docs)
          // and keep an index array of the discussions which should now be marked with an awarenesspoint
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

import '@webcomponents/custom-elements';
import { Show } from "solid-js";
import { mommentsStore, discussions, setDiscussions, user } from '$/store';
import { ActivationButton, SettingsButton, Discussion, DiscussionProxy, AddDiscussionButton, MommentsCanvas } from '$/components';
import { DiscussionService } from '$/services';
// import EmojiPicker from "./EmojiPicker";
// import { Picker } from 'emoji-mart'
// import data from '@emoji-mart/data'
// import Playlist from './components/Playlist';

function App() {
  let discussionsFetchIntervalHandler: NodeJS.Timeout | undefined
  // TODO can i add eventlistener to shadowroot???
  // props.shadowRoot.addEventListener('keydown', (event) => {
  //   console.log(event)
  // })
  // Blocks Shortcuts in BandLab (This is the BandLab body, not the chrome Extension body)
  document.querySelector('body')?.addEventListener(
    'keydown',
    (event) => {
      event.stopImmediatePropagation();
    },
    true
  );

  onMount(() => {
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

          const unreadDiscussions = dbDiscussions.filter(dbDisc => !dbDisc.readBy)
          const updateableReadDiscussionIndices = []

          for (const readDiscussion of unreadDiscussions) {
            const idx = discussions.list.findIndex((discussion) => discussion.id === readDiscussion.id)
            if (idx)
              updateableReadDiscussionIndices.push(idx)
          }

          if (updateableReadDiscussionIndices.length > 0) {
            setDiscussions('list', updateableReadDiscussionIndices, 'readBy', false)
          }

          // update the readBy property for all discussions
          // setDiscussions('list', (discussionsList) => {
          //   discussionsList.forEach((discussion) => {
          //     const dbDiscussion = dbDiscussions.find(dbDisc => dbDisc.id === discussion.id)
          //     discussion.readBy = dbDiscussion!.readBy
          //   })
          //   return discussionsList
          // })

        }
      }
    }, 1000)
  })

  onCleanup(() => {
    clearInterval(discussionsFetchIntervalHandler)
  })

  return (
    <>
      {/* <Playlist /> */}
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
      <div class='absolute bottom-5 w-full justify-center flex gap-5 items-center' style={`pointer-events: none;`}>
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

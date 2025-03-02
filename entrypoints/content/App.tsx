import '@webcomponents/custom-elements';
import { Show } from "solid-js";
import { mommentsStore, discussions } from './store';
import { ActivationButton, SettingsButton, Discussion, DiscussionProxy, AddDiscussionButton, MommentsCanvas } from './components';
// import EmojiPicker from "./EmojiPicker";
// import { Picker } from 'emoji-mart'
// import data from '@emoji-mart/data'
// import Playlist from './components/Playlist';

function App() {
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

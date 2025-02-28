import '@webcomponents/custom-elements';
import { Show } from "solid-js";
import { mommentsStore } from './store';
import { ActivationButton, AddCommentButton, SettingsButton, Discussion } from './components';
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

  const discussions = [
    {
      id: 1,
      position: {
        x: 300,
        y: 450
      },
    },
    {
      id: 2,
      position: {
        x: 600,
        y: 650
      },
    },
    {
      id: 3,
      position: {
        x: 200,
        y: 780
      },
    },
  ]

  return (
    <>
      {/* <Playlist /> */}
      {/* <div ref={emojiref}></div> */}
      {/* <EmojiPicker data={data} /> */}
      {/* Momments Comments Canvas */}
      <Show when={mommentsStore.appActive}>
        {/* Blocks interaction with the website below */}
        <div class="absolute top-0 bottom-0 left-0 right-0"></div>
        <For each={discussions}>
          {(discussion) => {
            return (
              <Discussion discussion={discussion} />
            )
          }}
        </For>
      </Show>

      {/* Momments Activator Button */}
      <div class='pointer-events-none absolute bottom-5 w-full justify-center flex gap-5 items-center'>
        {mommentsStore.user.token ? <>
        <Show when={mommentsStore.appActive}>
          <AddCommentButton />
        </Show>
          <ActivationButton />
        </> : <SettingsButton />}
      </div>
    </>
  );
}

export default App;

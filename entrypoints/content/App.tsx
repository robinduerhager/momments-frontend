import '@webcomponents/custom-elements';
import { Show } from "solid-js";
import { FaSolidComment, FaRegularFaceSmile } from "solid-icons/fa";
// import EmojiPicker from "./EmojiPicker";
// import { Picker } from 'emoji-mart'
// import data from '@emoji-mart/data'
import Playlist from './playlist';

function App() {
  const [active, setActive] = createSignal(false);
  // const [emojipicker, setEmojipicker] = createSignal({});
  // let emojiref;


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

  // onMount(() => {
  //   setEmojipicker(new Picker({ data }));
  //   emojiref!.appendChild(emojipicker());
  // });

  // onMount(async () => {
  //   await fetch('https://mhvdtry1ty.ufs.sh/f/h6uI8ZTQyqbsRWz4c0IsIdJQyEcMOmFP14Nwbe6TZz8vjfLo')
  // })

  return (
    <>
      <Playlist />
      {/* <div ref={emojiref}></div> */}
      {/* <EmojiPicker data={data} /> */}
      {/* Momments Comments Canvas */}
      <Show when={active()}>
        {/* Blocks interaction with the website below */}
        <div class="absolute top-0 bottom-0 left-0 right-0"></div>

        {/* Comment Button Prototypes */}
        <button popoverTarget="pop-1" class="bg-red-500 absolute top-[60%] left-[70%]" style="anchor-name: --comment-1;">Discussion 1</button>
        <button popoverTarget="pop-2" class="bg-blue-500 absolute top-[10%] left-[20%]" style="anchor-name: --comment-2;">Discussion 2</button>
        <button popoverTarget="pop-3" class="bg-green-500 absolute top-[80%] left-[30%]" style="anchor-name: --comment-3;">Discussion 3</button>

        {/* Popover Prototypes */}
        <div id="pop-1" class="w-[320px] h-[450px]" style="position-anchor: --comment-1; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;" popover>
          <div class="flex flex-col">
            <div>Comment 1</div>
            <div>Comment 2</div>
            <div>Comment 3</div>
            <div class="flex justify-center">
              <div contentEditable class="w-[295px] h-[85px] bg-white text-black">
                <FaRegularFaceSmile size={24} color="#000000" />
              </div>
              <textarea></textarea>
            </div>
          </div>
        </div>
        <div id="pop-2" class="w-[320px] h-[450px]" style="position-anchor: --comment-2; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;" popover>Comment 2 popover</div>
        <div id="pop-3" class="w-[320px] h-[450px]" style="position-anchor: --comment-3; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;" popover>Comment 3 popover</div>
      </Show>

      {/* Momments Activator Button */}
      <div class='absolute bottom-5 w-full justify-center flex'>
        <button class='cursor-pointer bg-blue-400 w-16 h-16 rounded-full flex justify-center items-center' onClick={() => setActive(!active())}>
          <FaSolidComment size={32} color='#ffffff' />
        </button>
      </div>
    </>
  );
}

export default App;

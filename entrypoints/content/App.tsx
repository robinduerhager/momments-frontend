import { Show } from "solid-js";
import { FaSolidComment } from "solid-icons/fa";

function App() {
  const [active, setActive] = createSignal(false);

  return (
    <>
    {/* Momments Comments Canvas */}
    <Show when={active()}>
      {/* Blocks interaction with the website below */}
      <div class="absolute top-0 bottom-0 left-0 right-0"></div>

      {/* Comment Button Prototypes */}
      <button popoverTarget="pop-1" class="bg-red-500 absolute top-[60%] left-[70%]" style="anchor-name: --comment-1;">Comment 1</button>
      <button popoverTarget="pop-2" class="bg-blue-500 absolute top-[10%] left-[20%]" style="anchor-name: --comment-2;">Comment 2</button>
      <button popoverTarget="pop-3" class="bg-green-500 absolute top-[80%] left-[30%]" style="anchor-name: --comment-3;">Comment 3</button>

      {/* Popover Prototypes */}
      <div id="pop-1" class="w-[320px] h-[450px]" style="position-anchor: --comment-1; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;" popover>Comment 1 popover</div>
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

// @ts-nocheck
import { Picker } from 'emoji-mart'
import data from '@emoji-mart/data'

export default function EmojiPicker(props) {
  let ref: HTMLDivElement;
  let [instance, setInstance] = createSignal(null);

  onMount(() => {
    setInstance(new Picker({ ...props, ref, data }))
    ref.appendChild(instance())
  })

  createEffect(() => {
    if (instance()) {
      instance().update(props)
    }
  })

  onCleanup(() => {
    setInstance(null)
  })

  return (
    <>
      <div ref={ref} class='absolute top-[-100px] left-0'></div>
    </>);
}
// @ts-nocheck
import { Picker } from 'emoji-mart'

export default function EmojiPicker(props) {
  let ref = null;
  let instance = null;

//   if (instance.current) {
//     instance.current.update(props)
//   }

  onMount(() => {
    instance = new Picker({ ...props, ref })
    console.log(instance)
  })

  return (<div ref={ref}></div>);
}
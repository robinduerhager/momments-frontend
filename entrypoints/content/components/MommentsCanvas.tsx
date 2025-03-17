import { onMount, onCleanup } from "solid-js"
import keyblocker from "$/utils/keyblocker"
import { mommentsStore } from "$/store"

export const MommentsCanvas = () => {
    const borderWidth = 5

    const labelWidth = 150
    const labelHeight = 25

    onMount(() => {
        console.log('mounted canvas')
        keyblocker.setup()
    })

    onCleanup(() => {
        if (!mommentsStore.settingsOpened)
            keyblocker.remove()
    })

    // style={`left: calc(50% - ${labelWidth / 2}px);`}
    return <div class={`fixed top-0 bottom-0 left-0 right-0 border-amber-300 border-solid border-${borderWidth}`}>
        <span class={`w-[${labelWidth}px] h-[${labelHeight}px] top-[-${borderWidth}px] text-zinc-800 left-[calc(50%-${labelWidth/2}px)] bg-amber-300 rounded-xs font-medium flex absolute items-end justify-center`} >Discussion Mode</span>
    </div>
}
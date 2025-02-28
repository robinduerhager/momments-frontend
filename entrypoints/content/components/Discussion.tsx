import { createSignal } from 'solid-js'
import { FaSolidComment } from 'solid-icons/fa'

export const Discussion = (props: {
    discussion: {
        id: number,
        position: {
            x: number,
            y: number
        }
    }
}) => {
    return (
        <>
            <button popoverTarget={`discussion-${props.discussion.id}-popover`} class="absolute cursor-pointer" style={`anchor-name: --discussion-${props.discussion.id}; top: ${props.discussion.position.y}px; left: ${props.discussion.position.x}px;`}>
                <FaSolidComment size={24} color="#ffffff" />
                <div class='w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-green-500'>
                    <div class='discussion-awareness-animation'></div>
                </div>
            </button>
            <div id={`discussion-${props.discussion.id}-popover`} class="w-[320px] h-[450px]" style={`position-anchor: --discussion-${props.discussion.id}; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;`} popover>Discussion {props.discussion.id} popover</div>
        </>
    )
}
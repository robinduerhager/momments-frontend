import { createSignal } from 'solid-js'
import { FaSolidComment } from 'solid-icons/fa'
import { setMommentsStore, discussions, setDiscussions } from '$/store'
import { DiscussionService, DiscussionDTO } from '$/services'
import { Position } from '$/utils/types'

const iconSize = 24

export const Discussion = (props: {
    discussion: DiscussionDTO
}) => {
    return (
        <>
            <button popoverTarget={`discussion-${props.discussion.id}-popover`} class="absolute cursor-pointer" style={`anchor-name: --discussion-${props.discussion.id}; top: ${props.discussion.posY}px; left: ${props.discussion.posX}px;`}>
                <FaSolidComment size={iconSize} color="#ffffff" />
                <div class='w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-green-500'>
                    <div class='discussion-awareness-animation'></div>
                </div>
            </button>
            <div id={`discussion-${props.discussion.id}-popover`} class="w-[320px] h-[450px]" style={`position-anchor: --discussion-${props.discussion.id}; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;`} popover>Discussion {props.discussion.id} popover</div>
        </>
    )
}

// Variant of the Discussion above without Awareness and popover functionality
// so the user can see where he will place a new Discussion
export const DiscussionProxy = () => {
    const [position, setPosition] = createSignal<Position>({ posX: 0, posY: 0 })

    const updatePosition = (e: MouseEvent) => {
        // By subtracting half of the icon size, the cursor will be in the center of the icon
        setPosition({ posX: e.clientX - iconSize / 2, posY: e.clientY - iconSize / 2 })
    }

    const initDiscussionCreation = async () => {
        // API call for creating a new Discussion
        const newDiscussion = await DiscussionService.createDiscussion(position())
        // Should append the Discussion list as well
        setDiscussions('list', discussions.list.length, newDiscussion)
        setMommentsStore('placeNewDiscussionMode', false)
    }

    onMount(() => {
        addEventListener('mousemove', updatePosition)
    })

    // Will be called when 'placeNewDiscussionMode' is set to false
    // since then the DiscussionProxy will be unmounted from the DOM
    onCleanup(() => {
        removeEventListener('mousemove', updatePosition)
    })

    return (
        <button onClick={initDiscussionCreation} class="absolute pointer-events-none" style={`top: calc(${position().posY}px); left: calc(${position().posX}px);`}>
            <FaSolidComment size={iconSize} color="#ffffff" />
        </button>
    )
}
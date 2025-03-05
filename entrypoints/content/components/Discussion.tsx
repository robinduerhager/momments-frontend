import { createSignal, Show } from 'solid-js'
import { FaSolidComment } from 'solid-icons/fa'
import { setMommentsStore, discussions, setDiscussions } from '$/store'
import { DiscussionService, DiscussionDTO } from '$/services'
import { Position } from '$/utils/types'
import { EditArea, Comment } from '$/components'

const iconSize = 24

export const Discussion = (props: {
    discussion: Omit<DiscussionDTO, 'comments'>
}) => {
    let popoverRef: HTMLDivElement | undefined;

    // Set Active Discussion when Popover Opens
    // Unset Active DIscussion when Popover Closes
    const onToggleDiscussionPopover = async (event: ToggleEvent) => {
        if (event.newState === 'open') {
            const completeDiscussion = await DiscussionService.getDiscussion(props.discussion.id, )
            console.log(completeDiscussion)
            setDiscussions('active', completeDiscussion)
        } else {
            setDiscussions('active', undefined)
        }
    }

    // On popover open and close...
    onMount(() => {
        popoverRef?.addEventListener('toggle', (e) => onToggleDiscussionPopover(e as ToggleEvent))
    })

    onCleanup(() => {
        popoverRef?.removeEventListener('toggle', (e) => onToggleDiscussionPopover(e as ToggleEvent))
    })

    return (
        <>
            <button popoverTarget={`discussion-${props.discussion.id}-popover`} class="absolute" style={`anchor-name: --discussion-${props.discussion.id}; top: ${props.discussion.posY}px; left: ${props.discussion.posX}px;`}>
                <FaSolidComment size={iconSize} color="#ffffff" />
                <div class='w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-green-500'>
                    <div class='discussion-awareness-animation'></div>
                </div>
            </button>
            <div ref={popoverRef} id={`discussion-${props.discussion.id}-popover`} class="w-[250px] h-[400px] rounded-md border-solid border border-zinc-300 overflow-visible" style={`position-anchor: --discussion-${props.discussion.id}; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;`} popover>
                {/* Comment Area */}
                <div class="flex flex-col h-[100%]">
                    <div class='flex-grow overflow-y-auto p-3'>
                        <For each={discussions.active?.comments}>
                            {(comment) => <Comment comment={comment} />}
                        </For>
                    </div>
                    <div class="flex flex-col justify-center border-t border-t-zinc-300 p-3">
                        <EditArea discussionId={props.discussion.id} />
                    </div>
                </div>
            </div>
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
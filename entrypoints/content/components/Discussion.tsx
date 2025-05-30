import { createSignal, Show, on } from 'solid-js'
import { FaSolidComment } from 'solid-icons/fa'
import { setMommentsStore, discussions, setDiscussions } from '$/store'
import { CommentService, DiscussionService, DiscussionDTO } from '$/services'
import { Position } from '$/utils/types'
import { EditArea, Comment } from '$/components'

const iconSize = 24

export const Discussion = (props: {
    discussion: Omit<DiscussionDTO, 'comments'>
}) => {
    let popoverRef: HTMLDivElement | undefined
    let commentsListRef: HTMLDivElement | undefined
    const draftExists = () => discussions.active?.comments.filter(comment => !comment.published).length === 1

    /**
     * @description Handles the toggle event of the discussion popover. If the popover is opened, it fetches the complete discussion with all comments and sets it as the active discussion. If it closes, it unsets the active discussion.
     * @param event The toggle event that is triggered when the popover is opened or closed.
     */
    const onToggleDiscussionPopover = async (event: ToggleEvent) => {
        // If popover has been opened: get all Comments for this Discussion
        if (event.newState === 'open') {
            const completeDiscussion = await DiscussionService.getDiscussion(props.discussion.id)

            // set readBy to true in the discussion list
            setDiscussions('list', discussion => discussion.id === props.discussion.id, 'readBy', true)
            setDiscussions('active', completeDiscussion)
        } else {
            setDiscussions('active', undefined)
        }
    }

    /**
     * @description Adjusts the scroll of the comments list to the bottom, so the latest comment is always visible.
     */
    const adjustScroll = () => {
        commentsListRef?.children[commentsListRef.children.length - 1]?.scrollIntoView(false)
    }

    /**
     * @description Handles the creation of a new draft comment in the active discussion. It checks if a draft already exists for this discussion and user, and if not, it creates a new draft comment.
     */
    const handleDraftCreation = async () => {
        if (!discussions.active)
            return console.error('No active discussion')

        // Since the backend sends only drafts for this user, the filtered array will be length of 1 or 0
        // depending on if a draft exists for this user in that discussion or not
        if (discussions.active.comments && discussions.active.comments.filter(comment => !comment.published).length === 1)
            return console.error('Draft already exists for this Discussion')

        // Else create a new draft
        const newDraft = await CommentService.createDraft(props.discussion.id)

        if (!newDraft)
            return console.error('Something went wrong')

        setDiscussions('active', (activeDiscussion) => ({
            ...activeDiscussion,
            comments: activeDiscussion ? [...activeDiscussion.comments, newDraft] : [newDraft]
        }))
    }

    // On popover open and close...
    onMount(() => {
        popoverRef?.addEventListener('toggle', (e) => onToggleDiscussionPopover(e as ToggleEvent))
    })

    onCleanup(() => {
        popoverRef?.removeEventListener('toggle', (e) => onToggleDiscussionPopover(e as ToggleEvent))
    })

    // Adjust the scroll of the comments list, whenever the active discussion changes
    // the comment list length changes
    // or the modules length of the comment draft changes
    createEffect(() => {
        discussions.active
        discussions.active?.comments.filter(comment => !comment.published)[0]?.modules?.length
        discussions.active?.comments.length
        if (discussions.active) {
            console.log('clicked discussion ID: ', discussions.active.id)   // Important for debugging and the test, if someone needs to delete a discussion (deletion was not implemented yet)
        }
        adjustScroll()
    })

    return (
        <>
            <button popoverTarget={`discussion-${props.discussion.id}-popover`} class="absolute" style={`anchor-name: --discussion-${props.discussion.id}; top: ${props.discussion.posY}px; left: ${props.discussion.posX}px;`}>
                <FaSolidComment size={iconSize} color="#ffffff" />
                <Show when={!discussions.list.find(discussion => discussion.id === props.discussion.id)?.readBy}>
                    <div class='w-[10px] h-[10px] rounded-full absolute bottom-0 right-0 bg-green-500'>
                        <div class='discussion-awareness-animation'></div>
                    </div>
                </Show>
            </button>
            <div ref={popoverRef} id={`discussion-${props.discussion.id}-popover`} class="w-[350px] h-[45vh] bg-zinc-950 rounded-md border-solid border border-zinc-200 overflow-visible" style={`position-anchor: --discussion-${props.discussion.id}; position-area: end; position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;`} popover>
                <Show when={discussions.active && discussions.active.id === props.discussion.id}>
                    {/* Comment Area */}
                    <div class="flex flex-col h-[100%] bg-zinc-950 text-white">
                        {/* Comments List Container */}
                        <div ref={commentsListRef} class='flex-grow overflow-y-auto commentsList'>
                            <For each={discussions.active?.comments}>
                                {(comment) => <Comment comment={comment} />}
                            </For>
                        </div>
                        <div class="flex flex-col justify-center border-t border-t-zinc-300 p-3">
                            {/* The Edit Area will only be rendered, if a draft exists */}
                            <Show when={draftExists()} fallback={<button class="button-primary" onClick={handleDraftCreation}>Add Draft</button>}>
                                <EditArea discussionId={props.discussion.id} />
                            </Show>
                        </div>
                    </div>
                </Show>
            </div>
        </>
    )
}

/**
 * @description The DiscussionProxy is a component that allows the user to place a new discussion on the page. It shows a discussion icon at the cursor position and creates a new discussion when clicked.
 */
export const DiscussionProxy = () => {
    const [position, setPosition] = createSignal<Position>({ posX: 0, posY: 0 })

    /**
     * @description Updates the position of the DiscussionProxy icon based on the mouse cursor position.
     * @param e The MouseEvent that is triggered when the user moves the mouse.
     */
    const updatePosition = (e: MouseEvent) => {
        // By subtracting half of the icon size, the cursor will be in the center of the icon
        setPosition({ posX: e.clientX - iconSize / 2, posY: e.clientY - iconSize / 2 })
    }

    /**
     * @description Initializes the discussion creation process by calling the DiscussionService to create a new discussion at the current position.
     */
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
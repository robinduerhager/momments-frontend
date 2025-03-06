import { discussions, setDiscussions } from '$/store'
import { CommentService, CommentModuleType } from '$/services'
import { createSignal } from 'solid-js'
import { FaSolidArrowUp, FaRegularFaceSmile } from 'solid-icons/fa'
import EmojiPicker from './EmojiPicker'

export const EditArea = (props: {
    discussionId: number
}) => {
    const [draftText, setDraftText] = createSignal('')
    const [showEmojiPicker, setShowEmojiPicker] = createSignal(false)

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker())
    }

    const handleEmojiSelect = (emoji: any) => {
        // Append the emoji to the draft text
        // And unmount the Emoji Picker
        setDraftText(draftText() + emoji.native)
        setShowEmojiPicker(false)
    }

    const appendTextModule = async (e: MouseEvent) => {
        if (!discussions.active)
            return console.error('No active discussion')

        if (!discussions.active.comments || discussions.active.comments.filter(comment => !comment.published).length === 0)
            return console.error('No draft present')

        const newModule = await CommentService.createCommentTextModule({
            commentId: discussions.active?.comments.filter(comment => !comment.published)[0].id,
            type: CommentModuleType.TEXT,
            content: draftText()
        })

        if (!newModule)
            return console.error('Something went wrong')

        setDiscussions('active', 'comments', (comment) => !comment.published, 'modules', (modules) => [...modules, newModule])
        setDraftText('')
    }

    return (
        <>
            {/* Show the Edit Area when a draft is present, else the Add Comment button */}
            {/* <Show when={discussions.active?.comments.length !== 0 && discussions.active?.comments.filter(comment => !comment.published)}> */}
                <div class="flex p-2 border-solid border-zinc-300 border rounded-md">
                    <textarea class='grow mr-2.5' style={`resize: none;`} onInput={(e) => { setDraftText(e.target.value) }} value={draftText()}></textarea>
                    <div class='flex flex-col gap-2.5'>
                        <button onClick={appendTextModule}>
                            <FaSolidArrowUp size={18} />
                        </button>
                        <button onClick={toggleEmojiPicker}> 
                            <FaRegularFaceSmile size={18} color='#9F9FA9' />
                        </button>
                        <Show when={showEmojiPicker()}>
                            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                        </Show>
                    </div>
                </div>
            {/* </Show> */}

        </>
    )
}
import { discussions, mommentsStore, setDiscussions } from '$/store'
import { CommentModuleType, CommentModulesService } from '$/services'
import { createSignal } from 'solid-js'
import { FaSolidArrowUp, FaRegularFaceSmile, FaBrandsSpotify, FaSolidMicrophone, FaSolidMusic, FaSolidXmark, FaSolidPaperPlane, FaSolidX } from 'solid-icons/fa'
import EmojiPicker from './EmojiPicker'
import { refSongEmbedder } from '$/services/embedders'
import { AudioRecorderModal } from '$/components'
import { CompositionModal } from './CompositionModal'

export const EditArea = (props: {
    discussionId: number
}) => {
    const [draftText, setDraftText] = createSignal('')
    const [showEmojiPicker, setShowEmojiPicker] = createSignal(false)
    const [spotifyInput, setSpotifyInput] = createSignal('')
    let refSongModuleModal: HTMLDialogElement | undefined;

    /**
     * @description derived Signal that returns the ID of the current draft comment. It filters the active discussion's comments to find the first comment that is not published, i.e. a draft.
     * @returns The ID of the draft comment or undefined if no draft exists.
     */
    const draftId = () => discussions.active?.comments.filter(comment => !comment.published)[0].id

    /**
     * @description Toggles the visibility of the EmojiPicker component.
     */
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker())
    }

    /**
     * @description Handles the selection of an emoji from the EmojiPicker. Appends the selected emoji to the current draft text and unmounts the EmojiPicker afterwards.
     * @param emoji The emoji object selected from the EmojiPicker.
     */
    const handleEmojiSelect = (emoji: any) => {
        setDraftText(draftText() + emoji.native)
        setShowEmojiPicker(false)
    }

    /**
     * @description Appends a text module to the current draft comment of the actively opened discussion.
     */
    const appendTextModule = async (e: MouseEvent) => {
        if (!discussions.active)
            return console.error('No active discussion')

        if (!discussions.active.comments || discussions.active.comments.filter(comment => !comment.published).length === 0)
            return console.error('No draft present')

        const commentId = draftId()
        if (!commentId)
            return console.error('Something went wrong')

        const newModule = await CommentModulesService.createCommentTextModule({
            commentId,
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
            <div class='flex mb-3 justify-evenly'>
                <button class='button-primary' onClick={() => {
                    refSongModuleModal?.showModal()
                }}><FaBrandsSpotify size={18} /></button>

                {/* Audio Module Modal */}
                <Show when={mommentsStore.audioInputDevice}>
                    <AudioRecorderModal commentId={draftId()!} />
                </Show>

                {/* Composition Modal */}
                <Show when={mommentsStore.audioInputDevice}>
                    <CompositionModal commentId={draftId()!} />
                </Show>

                {/* Spotify Modal */}
                <dialog class='w-[45vw]' ref={refSongModuleModal}>
                    <div class='flex mb-3'>
                        <h1 class='font-bold grow'>Spotify Song Embedder</h1>
                        <button onClick={() => {
                            // empty spotify input and just close the Modal
                            refSongModuleModal?.close()
                            setSpotifyInput('')
                        }}><FaSolidXmark size={18} /></button>
                    </div>
                    <div class='flex gap-5'>
                        <input placeholder='Spotify Link' type="text" value={spotifyInput()} onInput={(e) => setSpotifyInput(e.target.value)} />
                        <button disabled={!spotifyInput() || !refSongEmbedder.validate(spotifyInput())} onClick={async () => {
                            const commentId = draftId()

                            if (!commentId) {
                                refSongModuleModal?.close()
                                return console.error('Something went wrong')
                            }
                            // Create Spotify Module and close Modal
                            const newRefSongModule = await CommentModulesService.createCommentRefSongModule({
                                commentId,
                                content: spotifyInput()
                            })

                            if (!newRefSongModule)
                                return console.error('Something went wrong')

                            setDiscussions('active', 'comments', (comment) => !comment.published, 'modules', (modules) => [...modules, newRefSongModule])
                            refSongModuleModal?.close()
                            setSpotifyInput('')
                        }}><FaSolidPaperPlane size={18} /></button>
                    </div>
                </dialog>
            </div>

            {/* Texter */}
            <div class="flex p-2 border-solid border-zinc-200 border rounded-md">
                <textarea class='grow mr-2.5' style={`resize: none;`} onInput={(e) => { setDraftText(e.target.value) }} value={draftText()}></textarea>
                <div class='flex flex-col gap-2.5'>
                    {/* Button for adding the Text as TextModule to the draft */}
                    <button onClick={appendTextModule}>
                        <FaSolidArrowUp size={18} />
                    </button>
                    {/* Toggle Emojipicker Button */}
                    <button onClick={toggleEmojiPicker}>
                        <FaRegularFaceSmile size={18} color='#9F9FA9' />
                    </button>
                    {/* Show the EmojiPicker when it has been toggled */}
                    <Show when={showEmojiPicker()}>
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    </Show>
                </div>
            </div>
        </>
    )
}
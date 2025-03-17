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
    let compositionModuleModal: HTMLDialogElement | undefined;

    const draftId = () => discussions.active?.comments.filter(comment => !comment.published)[0].id

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
            {/* Show the Edit Area when a draft is present, else the Add Comment button */}
            {/* <Show when={discussions.active?.comments.length !== 0 && discussions.active?.comments.filter(comment => !comment.published)}> */}
            <div class='flex mb-3 justify-evenly'>
                {/* <button class='button-primary' popoverTarget={`discussion-${props.discussionId}-spotify-popover`}><FaBrandsSpotify size={18} /></button> */}
                <button class='button-primary' onClick={() => {
                    refSongModuleModal?.showModal()
                }}><FaBrandsSpotify size={18} /></button>
                {/* Edit Area will only be rendered, if a draft exists */}
                <Show when={mommentsStore.audioInputDevice}>
                    <AudioRecorderModal commentId={draftId()!} />
                </Show>
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

                {/* Audio Module Modal */}
                {/* <dialog class='min-w-80' ref={audioMessageModuleModal}>
                    <div class='flex justify-end'><button onClick={() => {
                        audioMessageModuleModal?.close()
                    }}><FaSolidX size={18} /></button></div>
                    <Show when={mommentsStore.audioInputDevice}>
                        <AudioRecorder />
                    </Show>
                </dialog> */}

                {/* Composition Modal */}
                <dialog ref={compositionModuleModal}>
                    <button class="button-primary" onClick={() => {
                        compositionModuleModal?.close()
                    }}>Close Composition Modal</button>
                </dialog>
            </div>
            <div class="flex p-2 border-solid border-zinc-200 border rounded-md">
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
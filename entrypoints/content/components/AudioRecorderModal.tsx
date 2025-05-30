import { createSignal } from "solid-js"
import { FaSolidMicrophone, FaSolidX } from "solid-icons/fa"
import { mommentsStore, setDiscussions } from "$/store"
import { AudioRecorder } from "$/components"
import { AudioFilesService, CommentModulesService } from "$/services"

export const AudioRecorderModal = (props: {
    commentId: number
}) => {
    let audioRecorderModuleModal: HTMLDialogElement | undefined;
    const [isVisible, setIsVisible] = createSignal(false)

    const handleClose = () => {
        setIsVisible(false)
    }

    const handleShow = () => {
        setIsVisible(true)
    }

    /**
     * 
     * @description Handles the saving of an audio message. It uploads the recorded audio blob to S3, creates a new AudioModule in the database, and appends it to the active discussion's comment.
     * @param blob The recorded audio blob that should be saved as an audio message module.
     */
    const handleAudioMessageSave = async (blob?: Blob) => {
        if (!blob)
            return console.error("can't save audio message")

        // Uploading the Blob will result in a random fileName which we can use to create a new AudioModule with an AudioFile
        const fileName: string = await AudioFilesService.uploadAudioBlob(blob)

        // Create a new AudioModule with the fileName
        const audioMessageModule = await CommentModulesService.createCommentAudioMessageModule({
            commentId: props.commentId,
            audioFileName: fileName
        })

        if (!audioMessageModule)
            return console.error('Failed to create audio message module')

        // Append the new AudioModule to the active discussion
        setDiscussions('active', 'comments', (comment) => comment.id === props.commentId, 'modules', (modules) => [...modules, audioMessageModule])
        handleClose()
    }

    createEffect(() => {
        if (isVisible()) {
            audioRecorderModuleModal?.showModal()
        } else {
            audioRecorderModuleModal?.close()
        }
    })

    return (
        <>
            {/* Show Recorder Modal Button */}
            <button class={`button-primary ${mommentsStore.audioInputDevice ? '' : 'disbaled'}`} onClick={handleShow}>
                <FaSolidMicrophone size={18} />
            </button>

            {/* Audio Recorder Module Modal */}
            <dialog class='w-[45vw]' ref={audioRecorderModuleModal}>

                {/* Close Button */}
                <div class='flex mb-5'>
                    <h1 class="grow font-bold">Audio Recorder</h1>
                    <button onClick={handleClose}>
                        <FaSolidX size={18} />
                    </button>
                </div>

                {/* Signal helps in mounting and unmounting lifecycle with modals and popovers */}
                <Show when={isVisible()}>
                    <AudioRecorder onSaveClicked={handleAudioMessageSave} />
                </Show>
            </dialog>
        </>
    )
}
import { createSignal } from "solid-js"
import { FaSolidX, FaSolidMusic } from "solid-icons/fa"
import { mommentsStore, setDiscussions } from "$/store"
import { CompositionEditor } from "$/components"
import { AudioFilesService, CommentModulesService } from "$/services"

export const CompositionModal = (props: {
    commentId?: number
}) => {
    let compositionModal: HTMLDialogElement | undefined;
    const [isVisible, setIsVisible] = createSignal(false)

    const handleClose = () => {
        setIsVisible(false)
    }

    const handleShow = () => {
        setIsVisible(true)
    }

    const handleOnSaveComposition = async (tracks: {
            fileId: number
            startPosition: number,
            // volume: number,
            startCue: number,
            endCue: number
    }[]) => {
        // Create new CompositionModule with the tracks which have to be linked to
        // the already uploaded AudioFiles (fileId)

        
    }

    createEffect(() => {
        if (isVisible()) {
            compositionModal?.showModal()
        } else {
            compositionModal?.close()
        }
    })

    return (
        <>
            {/* Show Recorder Modal Button */}
            <button class={`button-primary ${mommentsStore.audioInputDevice ? '' : 'disbaled'}`} onClick={handleShow}>
                <FaSolidMusic size={18} />
            </button>

            {/* Audio Recorder Module Modal */}
            <dialog class='w-[80vw] h-[60vh]' ref={compositionModal}>

                {/* Close Button */}
                <div class='flex mb-5'>
                    <h1 class="grow font-bold">Kompositions Editor</h1>
                    <button onClick={handleClose}>
                        <FaSolidX size={18} />
                    </button>
                </div>

                {/* Signal helps in mounting and unmounting lifecycle with modals and popovers */}
                <Show when={isVisible()}>
                    <CompositionEditor onSave={handleOnSaveComposition} />
                </Show>
            </dialog>
        </>
    )
}
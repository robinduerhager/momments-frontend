import { createSignal } from "solid-js"
import { FaSolidMicrophone, FaSolidStop, FaSolidX, FaSolidUpload } from "solid-icons/fa"
import Recorder from 'opus-recorder'
import { mommentsStore } from "$/store"
import { AudioRecorder } from "$/components"

export const AudioRecorderModal = () => {
    let audioRecorderModuleModal: HTMLDialogElement | undefined;
    const [isVisible, setIsVisible] = createSignal(false)

    const handleClose = () => {
        setIsVisible(false)
    }

    const handleShow = () => {
        setIsVisible(true)
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
                    <AudioRecorder onModalShouldClose={handleClose} />
                </Show>
            </dialog>
        </>
    )
}
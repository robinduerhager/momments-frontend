import { onCleanup, onMount } from 'solid-js'
import { createSignal } from 'solid-js'
import { FaSolidMicrophone, FaSolidStop, FaSolidUpload } from 'solid-icons/fa'
import { mommentsStore } from '$/store'
import Recorder from 'opus-recorder'

export const AudioRecorder = (props: {
    onModalShouldClose: () => void
    onSaveClicked: (blob?: Blob) => void
}) => {
    const encoderPath = 'https://cdn.jsdelivr.net/npm/opus-recorder/dist/encoderWorker.min.js'

    const [isRecording, setIsRecording] = createSignal(false)
    const [audioBlob, setAudioBlob] = createSignal<Blob | undefined>(undefined)
    const [recorder, setRecorder] = createSignal<any | undefined>(undefined)

    onMount(() => {
        const opusRecorder = new Recorder({
            encoderPath: encoderPath,
            mediaTrackConstraints: {
                deviceId: mommentsStore.audioInputDevice?.deviceId,
                echoCancellation: false,
                noiseSuppression: false,
            },
            numberOfChannels: 1,
            recordingGain: 1,
            monitorGain: 0,
        })

        // Set the audio blob when it has been returned from the recorder
        opusRecorder.ondataavailable = (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'audio/ogg; codecs=opus' })
            setAudioBlob(blob)
        }

        setRecorder(opusRecorder)
    })

    onCleanup(() => {
        setAudioBlob(undefined)
        setIsRecording(false)
        setRecorder(undefined)
    })

    const handleSaveRecording = () => {
        // save the audio blob
        props.onSaveClicked(audioBlob())
        // finally, close the modal
        props.onModalShouldClose()
    }

    return (
        <div class="flex flex-col gap-5">
            <Show when={audioBlob()}>
                <div class="flex justify-center">
                    <audio controls src={URL.createObjectURL(audioBlob()!)}></audio>
                </div>
            </Show>
            <div class="flex justify-center gap-3">
                <button onClick={() => {
                    if (isRecording()) {
                        recorder()?.stop()
                        setIsRecording(false)
                    } else {
                        recorder()?.start()
                        setIsRecording(true)
                    }
                }} class={`flex justify-center items-center rounded-full w-10 h-10 ${isRecording() ? 'bg-red-500 text-white' : 'bg-zinc-200 text-zinc-700'}`}>{isRecording() ? <FaSolidStop size={18} /> : <FaSolidMicrophone size={18} />}
                </button>
                <Show when={audioBlob()}>
                    <button class="flex justify-center items-center bg-green-600 rounded-full w-10 h-10" onClick={handleSaveRecording}>
                        <FaSolidUpload size={18} />
                    </button>
                </Show>
            </div>
        </div>
    )
}
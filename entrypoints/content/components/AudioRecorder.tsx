import { onCleanup, onMount } from 'solid-js'
import { createSignal } from 'solid-js'
import { FaSolidMicrophone, FaSolidStop, FaSolidUpload } from 'solid-icons/fa'
import { mommentsStore } from '$/store'
import Recorder from 'opus-recorder'

export const AudioRecorder = (props: {
    onSaveClicked: (blob?: Blob) => void
    onRecord?: () => void
    onStop?: () => void
}) => {
    const encoderPath = 'https://cdn.jsdelivr.net/npm/opus-recorder/dist/encoderWorker.min.js'

    const [isRecording, setIsRecording] = createSignal(false)
    const [countdown, setCountdown] = createSignal(0)
    const [audioBlob, setAudioBlob] = createSignal<Blob | undefined>(undefined)
    const [recorder, setRecorder] = createSignal<any | undefined>(undefined)
    const countdownLength: number = 4
    let countdownInterval: NodeJS.Timeout | undefined

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

        // Bind Event to set the audio blob in a signal when it has been returned from the recorder
        // An existing AudioBlobg will trigger an audio element with which the user can listen to the recording
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
        clearInterval(countdownInterval)
    })

    // Start the recording when 1 second is left (else the audio will be cut off a little)
    // This will result in longer blobs which also helps in arranging recordings when used by the multitrack editor
    createEffect(() => {
        if (!isRecording() && countdown() === 1) {
            recorder()?.start()
            setIsRecording(true)
        }
    })

    /**
     * @description Starts a countdown before the recording begins. The countdown is displayed on the record button and starts at the given number of seconds and gives the user time to prepare for the recording (e.g. by grabbing the guitar and chords etc.).
     * @param seconds The number of seconds to count down before starting the recording.
     */
    const startRecordingAfterCountdown = (seconds: number) => {
        setCountdown(seconds)
        countdownInterval = setInterval(() => {
            const newCountdown = countdown() - 1
            setCountdown(newCountdown)
            if (newCountdown === 0) {
                props.onRecord?.()
                return clearInterval(countdownInterval)
            }
        }, 1000)
    }

    /**
     * @description Handles the saving of the recorded audio blob. It calls the provided onSaveClicked function with the audio blob. E.g. the AudioRecorderModal will create an AudioMessageModule, while in the CompositionEditor it will add a new track to the multitrack editor.
     */
    const handleSaveRecording = () => {
        props.onSaveClicked(audioBlob())
    }

    return (
        <div class="flex flex-col gap-5 grow">
            {/* Show an audio element with which the user can listen to his recording if a recording exists */}
            <Show when={audioBlob()}>
                <div class="flex justify-center">
                    {/* Using a local URL for the recorded blob works fine for the audio element */}
                    <audio controls src={URL.createObjectURL(audioBlob()!)}></audio>
                </div>
            </Show>
            <div class="flex justify-center gap-3">
                {/* Record / Record Stop Button */}
                <button onClick={() => {
                    if (isRecording()) {
                        recorder()?.stop()
                        props.onStop?.()
                        setIsRecording(false)
                    } else {
                        startRecordingAfterCountdown(countdownLength)
                    }
                }} class={`flex justify-center items-center rounded-full w-10 h-10 font-bold text-2xl ${isRecording() ? 'bg-red-500 text-white' : 'bg-zinc-200 text-zinc-700'}`} disabled={countdown() > 0}>{countdown() > 0 ? countdown() : (isRecording() ? <FaSolidStop size={18} /> : <FaSolidMicrophone size={18} />)}
                </button>
                {/* Save Button only shown if a recording exists */}
                <Show when={audioBlob()}>
                    <button class="flex justify-center items-center bg-green-600 rounded-full w-10 h-10" onClick={handleSaveRecording}>
                        <FaSolidUpload size={18} />
                    </button>
                </Show>
            </div>
        </div>
    )
}
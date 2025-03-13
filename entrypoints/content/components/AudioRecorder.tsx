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
        clearInterval(countdownInterval)
    })

    // Start the recording when 1 second is left (else the audio will be cut off a little)
    createEffect(() => {
        if (!isRecording() && countdown() === 1) {
            recorder()?.start()
            setIsRecording(true)
        }
    })

    // The countdown also gives the user some time to prepare for the recording (e.g. grabbing the guitar and chords etc.)
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

    const handleSaveRecording = () => {
        // save the audio blob
        props.onSaveClicked(audioBlob())
    }

    return (
        <div class="flex flex-col gap-5 grow">
            <Show when={audioBlob()}>
                <div class="flex justify-center">
                    <audio controls src={URL.createObjectURL(audioBlob()!)}></audio>
                </div>
            </Show>
            <div class="flex justify-center gap-3">
                <button onClick={() => {
                    if (isRecording()) {
                        recorder()?.stop()
                        props.onStop?.()
                        setIsRecording(false)
                    } else {
                        startRecordingAfterCountdown(4)
                        // recorder()?.start()
                        // props.onRecord?.()
                        // setIsRecording(true)
                    }
                }} class={`flex justify-center items-center rounded-full w-10 h-10 font-bold text-2xl ${isRecording() ? 'bg-red-500 text-white' : 'bg-zinc-200 text-zinc-700'}`} disabled={countdown() > 0}>{countdown() > 0 ? countdown() : (isRecording() ? <FaSolidStop size={18} /> : <FaSolidMicrophone size={18} />)}
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
import { createSignal } from "solid-js"
import { FaSolidMicrophone, FaSolidStop } from "solid-icons/fa"
import Recorder from 'opus-recorder'
import { mommentsStore } from "$/store"

export const AudioRecorder = () => {
    const encoderPath = 'https://cdn.jsdelivr.net/npm/opus-recorder/dist/encoderWorker.min.js'
    // const waveEncoderPath = 'https://cdn.jsdelivr.net/npm/opus-recorder/dist/waveWorker.min.js'

    const [isRecording, setIsRecording] = createSignal(false)
    const [audioBlob, setAudioBlob] = createSignal<Blob | null>(null)
    const [recorder, setRecorder] = createSignal<any | null>(null)
    let waveSurferRoot: HTMLDivElement | undefined = undefined

    onMount(async () => {
        // Request Microphone Access
        // const devices = await navigator.mediaDevices.enumerateDevices()
        // setAvailableDevices(devices.filter(device => device.kind === 'audioinput'))
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

        opusRecorder.ondataavailable = (buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], { type: 'audio/ogg; codecs=opus' })
            setAudioBlob(blob)
        }

        setRecorder(opusRecorder)
    })

    // onCleanup(() => {
    //     // waveSurferInstance()?.destroy()
    //     // recorderPluginInstance()?.destroy()
    // })

    // createEffect(async () => {
    //     if (availableDevices().length > 0 && mommentsStore.audioInputDevice) {
    //         // Initialize new Opus Recorder, when selectedDevice changes
    //         const opusRecorder = new OpusRecorder({
    //             encoderPath: encoderPath,
    //             mediaTrackConstraints: {
    //                 deviceId: mommentsStore.audioInputDevice?.deviceId,
    //                 echoCancellation: false,
    //                 noiseSuppression: false,
    //             },
    //             numberOfChannels: 1,
    //             recordingGain: 1,
    //             monitorGain: 0,
    //         })

    //         opusRecorder.ondataavailable = (buffer: ArrayBuffer) => {
    //             const blob = new Blob([buffer], { type: 'audio/ogg; codecs=opus' })
    //             setAudioBlob(blob)
    //         }

    //         setOpusRecorderInstance(opusRecorder)
    //     }
    // })

    return (
        <div>
            <div class="max-w-72" ref={waveSurferRoot}></div>
            <button onClick={() => {
                if (isRecording()) {
                    recorder()?.stop()
                    setIsRecording(false)
                } else {
                    recorder()?.start()
                    setIsRecording(true)
                }
            }} class="button-primary bg-red-700 rounded-full">{isRecording() ? <FaSolidStop color="ffffff" size={18} /> : <FaSolidMicrophone color="ffffff" size={18} />}</button>
            <Show when={audioBlob()}>
                <audio controls src={URL.createObjectURL(audioBlob()!)}></audio>
            </Show>
        </div>
    )
}
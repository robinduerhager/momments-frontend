import { createSignal } from "solid-js"
import { FaSolidMicrophone, FaSolidStop } from "solid-icons/fa"
import WaveSurfer from "wavesurfer.js"
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js"

export const AudioRecorder = () => {
    const [isRecording, setIsRecording] = createSignal(false)
    const [audioBlob, setAudioBlob] = createSignal<Blob | null>(null)
    const [waveSurferInstance, setWaveSurferInstance] = createSignal<WaveSurfer | null>(null)
    const [recorderPluginInstance, setRecorderPluginInstance] = createSignal<RecordPlugin | null>(null)
    const [availableDevices, setAvailableDevices] = createSignal<MediaDeviceInfo[]>([])
    const [selectedDevice, setSelectedDevice] = createSignal<MediaDeviceInfo | null>(null)
    let waveSurferRoot: HTMLDivElement | undefined = undefined

    onMount(async () => {
        // Request Microphone Access
        await navigator.mediaDevices.getUserMedia({ audio: true })

        if (waveSurferRoot){
            const waveSurfer = WaveSurfer.create({
                container: waveSurferRoot,
                waveColor: 'violet',
                progressColor: 'purple'
            })

            const record = waveSurfer.registerPlugin(
                RecordPlugin.create({
                  renderRecordedAudio: false,
                  mimeType: 'audio/webm; codecs=opus',
                  continuousWaveform: true,
                  continuousWaveformDuration: 30, // optional
                }),
              )

              setAvailableDevices(await RecordPlugin.getAvailableAudioDevices())
              setWaveSurferInstance(waveSurfer)
              setRecorderPluginInstance(record)

              record.on('record-end', (blob: Blob) => {
                setAudioBlob(blob)
              })
        }
    })

    onCleanup(() => {
        waveSurferInstance()?.destroy()
        recorderPluginInstance()?.destroy()
    })

    return (
        <div>
            <select
                value={selectedDevice()?.deviceId}
                onInput={(e) => {
                    const deviceId = e.currentTarget.value
                    const selectedDevice = availableDevices().find(device => device.deviceId === deviceId) || null
                    setSelectedDevice(selectedDevice)
                }}
            >
                <For each={availableDevices()}>
                {(device) => <option value={device.deviceId}>{device.label}</option>}
                </For>
            </select>
            <div class="max-w-72" ref={waveSurferRoot}></div>
            <button onClick={() => {
                if (isRecording()) {
                    recorderPluginInstance()?.stopRecording()
                    setIsRecording(false)
                } else {
                    recorderPluginInstance()?.startRecording({
                        deviceId: selectedDevice()?.deviceId
                    })
                    setIsRecording(true)
                }
            }} class="button-primary bg-red-700 rounded-full">{isRecording() ? <FaSolidStop color="ffffff" size={18} /> : <FaSolidMicrophone color="ffffff" size={18} />}</button>
            <Show when={audioBlob()}>
                <audio controls src={URL.createObjectURL(audioBlob()!)}></audio>
            </Show>
        </div>
    )
}
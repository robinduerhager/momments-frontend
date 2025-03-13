import { createSignal, onCleanup, For } from "solid-js";
import { createStore } from "solid-js/store";
import { FaSolidPlay, FaSolidPause, FaSolidTrash, FaSolidVolumeXmark, FaSolidVolumeHigh } from "solid-icons/fa";
import { AudioRecorder } from "$/components"
import { AudioFilesService } from "$/services";
import WavesurferMultitrack, { MultitrackTracks, MultitrackOptions } from 'wavesurfer-multitrack';

export const CompositionEditor = (props: {
    onSave: (tracks: any) => void
}) => {
    let wavesurferMultitrackRoot: HTMLDivElement | undefined;
    const [isPlaying, setIsPlaying] = createSignal(false)
    const [multitrack, setMultitrack] = createSignal<WavesurferMultitrack | undefined>(undefined)
    const [audioFilesStore, setAudioFilesStore] = createStore<{id: number, fileName: string, muted: boolean}[]>([])
    let pauseChecker: NodeJS.Timeout | undefined = undefined
    const trackHeight: number = 70
  
      onCleanup(() => {
          multitrack()?.destroy()
          if (pauseChecker)
            clearInterval(pauseChecker)
      })
  
      createEffect(() => {
          pauseChecker = setInterval(() => {
                setIsPlaying(multitrack()?.isPlaying() ?? false)
          }, 1000)
      })

    const handleTogglePlayButton = () => {
        setIsPlaying(!isPlaying())
        if (multitrack()?.isPlaying()) {
            multitrack()?.pause()
        } else {
            multitrack()?.play()
        }
    }

    const handleAddAudioTrack = async (blob?: Blob) => {
        
        if (!blob)
            return console.error("can't save audio message")
        
        // Upload recorded blob to S3
        // Uploading the Blob will result in a random fileName which we can use to create a new AudioFile
        const fileName: string = await AudioFilesService.uploadAudioBlob(blob)
        
        // Create a new AudioFile with the fileName
        // Be aware that audioFile.fileName is now the S3 url !!!
        const audioFile = await AudioFilesService.create(fileName)

        if (!audioFile)
            return console.error('Failed to create audio file')

        const newTrack = {
            id: audioFile.id,
            draggable: true,
            startPosition: 0,
            volume: 0.95,
            startCue: 0.5,
            endCue: 1,
            url: audioFile.fileName, //URL.createObjectURL(blob!), //some blob sometimes ended up in not being rendered somehow
            options: {
                height: trackHeight
            }
        }

        const beforeTracks = sanitizeTracks(multitrack()?.tracks)
        recreateMultitrackInstance([...beforeTracks, newTrack])
        setAudioFilesStore(audioFilesStore.length, { id: audioFile.id, fileName: audioFile.fileName, muted: false })
    }

    const recreateMultitrackInstance = (tracks: MultitrackTracks) => {
        if (multitrack()) {
            multitrack()?.destroy()
        }

        setMultitrack(WavesurferMultitrack.create(sanitizeTracks(tracks), {
            container: wavesurferMultitrackRoot!, // required!
            minPxPerSec: 10, // zoom level
            rightButtonDrag: false, // set to true to drag with right mouse button
            dragBounds: false,
            cursorWidth: 2,
            cursorColor: '#D72F21',
            trackBackground: '#2D2D2D',
            trackBorderColor: '#7C7C7C',
        }))
    }

    const sanitizeTracks = (tracks?: MultitrackTracks) => tracks ? tracks.filter(t => t.id !== 'placeholder') ?? [] : []

    const onSave = () => {
        // Aggregate all the tracks and uplift them to the CompositionModal for saving
        // track.id = audioFile id in the DB
        // track.fileName = s3 URL which should be remove for storing, since the db already has the s3 fileName stored
        const tracks = sanitizeTracks(multitrack()?.tracks)

        if (!tracks)
            return console.error('No tracks to save')

        props.onSave(
            tracks.map(track => {
                // We only store startPosition, startCue and endCue
                // Volume is for isolating audio tracks, for individual critical listening
                return {
                    fileId: track.id,
                    startPosition: track.startPosition,
                    // volume: track.volume,
                    startCue: track.startCue,
                    endCue: track.endCue
                }
            })
        )
    }

    return (
        <div class="flex flex-col h-[90%] gap-2.5">
            <button onClick={handleTogglePlayButton}>{isPlaying() ? <FaSolidPause size={20} /> : <FaSolidPlay size={20} />}</button>
            <div class="grow overflow-y-auto">
                <div class="flex">
                    <div class="flex flex-col mr-2">
                        <For each={audioFilesStore}>
                            {(audioFile, idx) => <><div class={`border border-zinc-200 p-2 flex flex-col gap-2.5 items-center h-[${trackHeight}px]`}>
                                <p>Track {idx() + 1}</p>
                                <div class="flex gap-5">
                                    <button onClick={() => { // Remove Track
                                        // Get Multitrack tracks and remove the track with the same id as the audioFile
                                        const newTracks = multitrack()?.tracks.filter(t => t.id !== audioFile.id)

                                        if (!newTracks)
                                            return console.error('Failed to remove track')

                                        recreateMultitrackInstance(newTracks)
                                        setAudioFilesStore(audioFilesStore.filter(file => file.id !== audioFile.id))
                                    }}><FaSolidTrash size={18} /></button>
                                    <button onClick={() => { // Toggle Track volume
                                        const wasMuted = multitrack()?.tracks[idx()].volume! < 0.5
                                        multitrack()?.setTrackVolume(idx(), wasMuted ? 1 : 0) // If the track was muted before, unmute and vice versa
                                        setAudioFilesStore(audioFilesStore.findIndex(file => file.id === audioFile.id), 'muted', wasMuted ? false : true) // same for the ui display
                                    }}><FaSolidVolumeHigh color={`${audioFile.muted ? 'gray' : 'white'}`} size={18} /></button>
                                </div>
                            </div>
                            <div class={`w-full bg-zinc-400`} style={`height: ${idx() === audioFilesStore.length - 1 ? '2' : '4'}px`}></div>
                            </>}
                        </For>
                    </div>
                    <div class="grow" ref={wavesurferMultitrackRoot}></div>
                </div>
            </div>
                <div class="flex justify-center">
                    <AudioRecorder onRecord={() => { if (!multitrack()?.isPlaying()) { multitrack()?.seekTo(0); multitrack()?.play() } }} onStop={() => { if (multitrack()?.isPlaying()) multitrack()?.pause() }} onSaveClicked={handleAddAudioTrack} />
                    <button class="button-primary bg-green-600 self-end" onClick={onSave}>Save</button>
                </div>
        </div>
    )

}
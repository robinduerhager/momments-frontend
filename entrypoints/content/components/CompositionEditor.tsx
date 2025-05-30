import { createSignal, onCleanup, For } from "solid-js";
import { createStore } from "solid-js/store";
import { FaSolidPlay, FaSolidPause, FaSolidTrash, FaSolidVolumeHigh } from "solid-icons/fa";
import { AudioRecorder } from "$/components"
import { AudioFilesService } from "$/services";
import WavesurferMultitrack, { MultitrackTracks } from 'wavesurfer-multitrack';

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

    /**
     * @description Handles the addition of a new audio track to the multitrack editor. Uploads the recorded audio blob to S3, creates a new AudioFile in the database, and adds the URL of the uploaded audiofile as a new track to the multitrack editor.
     * @param blob The recorded audio blob that should be added as a new track to the multitrack editor.
     */
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
            url: audioFile.fileName, // I would like to have used URL.createObjectURL(blob!) for this, but often times this lead to ambiguous errors. Using an S3 URL is somehow more reliable
            options: {
                height: trackHeight
            }
        }

        const beforeTracks = sanitizeTracks(multitrack()?.tracks)
        recreateMultitrackInstance([...beforeTracks, newTrack])
        setAudioFilesStore(audioFilesStore.length, { id: audioFile.id, fileName: audioFile.fileName, muted: false })
    }

    /**
     * @description Recreates the multitrack instance with the given tracks. This is necessary because wavesurfer-multitrack does not provide a way to remove tracks, so we have to destroy and recreate the instance with new tracks.
     * @param tracks The tracks to recreate the multitrack instance with.
     */
    const recreateMultitrackInstance = (tracks: MultitrackTracks) => {
        if (multitrack()) {
            multitrack()?.destroy()
        }

        setMultitrack(WavesurferMultitrack.create(sanitizeTracks(tracks), {
            container: wavesurferMultitrackRoot!, // Wavesurfer-Multitrack mounts into an HTML Element so this field is required!
            minPxPerSec: 10,
            rightButtonDrag: false,
            dragBounds: false, // Enables dragging of tracks outside the container (just to the right, removing bounds to the left is only possible via the modified version in lib/wavesurfer-multitrack)
            cursorWidth: 2,
            cursorColor: '#D72F21',
            trackBackground: '#2D2D2D',
            trackBorderColor: '#7C7C7C',
        }))
    }

    // The track with the id 'placeholder' is important for wavesurfer-multitrack but not for our application, so remove it
    /**
     * 
     * @description This function is used to sanitize the tracks before saving them to the database. It filters out the track with the id 'placeholder' which is used by wavesurfer-multitrack for internal purposes but not needed in our application.
     * @param tracks The tracks to sanitize.
     * @returns An array of tracks without the 'placeholder' track.
     */
    const sanitizeTracks = (tracks?: MultitrackTracks) => tracks ? tracks.filter(t => t.id !== 'placeholder') ?? [] : []

    /**
     * @description This function aggregates all the tracks and uplifts them into the CompositionModal save method.
     */
    const onSave = () => {
        // Aggregate all the tracks and uplift them to the CompositionModal for saving
        const tracks = sanitizeTracks(multitrack()?.tracks)

        if (!tracks)
            return console.error('No tracks to save')

        props.onSave(
            tracks.map(track => {
                // We only store startPosition, startCue and endCue. track.fileName (the s3 URL) is already stored in the database (as the audioFile), doesn't need to be stored twice
                // Volume is for isolating audio tracks, for individual critical listening
                return {
                    fileId: track.id, // track.id is the audioFile ID and therefore its foreign key in the Database which we have to connect here
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

                                        // Recreate the multitrack instance with the new tracks to update the UI (this is bad practice but practical for the prototype since there is no removeTrack function in wavesurfer-multitrack and somehow adding this to the library is way more complicated than expected)
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
                    {/* wavesurfer-multitrack will mount here */}
                    <div class="grow" ref={wavesurferMultitrackRoot}></div>
                </div>
            </div>
                {/* Multitrack uses the AudioRecorder for recording tracks */}
                <div class="flex justify-center">
                    <AudioRecorder onRecord={() => { if (!multitrack()?.isPlaying()) { multitrack()?.seekTo(0); multitrack()?.play() } }} onStop={() => { if (multitrack()?.isPlaying()) multitrack()?.pause() }} onSaveClicked={handleAddAudioTrack} />
                    <button class="button-primary bg-green-600 self-end" onClick={onSave}>Save</button>
                </div>
        </div>
    )

}
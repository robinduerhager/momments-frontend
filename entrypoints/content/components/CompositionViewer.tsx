import { createSignal, onMount, onCleanup } from "solid-js";
import { createStore } from 'solid-js/store'
import { FaSolidPause, FaSolidPlay, FaSolidTrash, FaSolidVolumeHigh } from "solid-icons/fa"
import WavesurferMultitrack, { MultitrackTracks } from 'wavesurfer-multitrack';
import { CommentDTO, CommentModuleDTO } from "$/services"

export const CompositionViewer = (props: {
    onDelete: (id: number) => void,
    comment: CommentDTO,
    module: CommentModuleDTO
}) => {
    const [multitrack, setMultitrack] = createSignal<WavesurferMultitrack | undefined>(undefined)
    const [isPlaying, setIsPlaying] = createSignal(false)
    const [mutedTracks, setMutedTracks] = createStore<boolean[]>([]) // this is just for displaying the right volume icon
    let multitrackRoot: HTMLDivElement | undefined;
    let pauseChecker: NodeJS.Timeout | undefined;
    const trackHeight: number = 40

    onMount(() => {
        if (!props.module.composition)
            return console.error('No composition found in this module')

        if (!multitrackRoot)
            return console.error('No root element found')

        const tracks: MultitrackTracks = props.module.composition.audioTracks.map(track => ({
            id: track.id,
            startPosition: track.startPosition,
            draggable: false,
            startCue: track.startCue,
            endCue: track.endCue,
            url: track.audioFile.fileName,
            options: {
                height: trackHeight
            },
            volume: 0.95
        }))

        setMultitrack(WavesurferMultitrack.create(tracks, {
                container: multitrackRoot!, // required!
                rightButtonDrag: false, // set to true to drag with right mouse button
                dragBounds: false,
                cursorWidth: 2,
                cursorColor: '#D72F21',
                trackBackground: '#2D2D2D',
                trackBorderColor: '#7C7C7C',
            }))

        // First, all tracks are unmuted
        setMutedTracks(Array(tracks.length).fill(false))

        // initialize pause checker (since multitrack doesn't provide a "finished" event)
        pauseChecker = setInterval(() => {
            setIsPlaying(multitrack()?.isPlaying() ?? false)
        }, 1000)
    })

    onCleanup(() => {
        clearInterval(pauseChecker)
        multitrack()?.destroy()
    })

    const handleTogglePlayButton = () => {
        if (!multitrack())
            return console.error('No multitrack found')

        if (multitrack()?.isPlaying()) {
            multitrack()?.pause()
            setIsPlaying(false)
        } else {
            multitrack()?.play()
            setIsPlaying(true)
        }
    }

    createEffect(() => {
        console.log(multitrack())
    })

    const toggleMute = (idx: number, wasMuted: boolean) => {
        if (!multitrack())
            return console.error('No multitrack found')

        setMutedTracks(idx, !wasMuted)
        multitrack()?.setTrackVolume(idx, wasMuted ? 1 : 0)
    }

    return (
        <div>
            <button onClick={handleTogglePlayButton}>
                <Show when={!isPlaying()} fallback={<FaSolidPause size={18} />}>
                    <FaSolidPlay size={18} />
                </Show>
            </button>
            <div class={`${!props.comment.publishedAt ? 'flex pr-4 items-center' : 'flex items-center'}`}>
                <div class="flex flex-col mr-2">
                    <For each={mutedTracks}>
                        {(muted, idx) => (
                            <div style={`height: ${trackHeight + 2}px;`}>
                                <button onClick={() => toggleMute(idx(), muted)}>
                                    <FaSolidVolumeHigh size={18} color={`${muted ? 'gray' : 'white'}`} />
                                </button>
                            </div>
                        )}
                    </For>
                </div>
                <div class="grow" ref={multitrackRoot}></div>
                <Show when={!props.comment.publishedAt}>
                    <button onClick={() => props.onDelete(props.module.id)}>
                        <FaSolidTrash size={16} />
                    </button>
                </Show>
            </div>
        </div>
    )
}
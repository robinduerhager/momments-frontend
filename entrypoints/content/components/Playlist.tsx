import { onMount, onCleanup, createSignal } from "solid-js";
import Multitrack from 'wavesurfer-multitrack';

export default () => {
    let playlistEl: undefined | HTMLDivElement = undefined;
    let [isPlaying, setIsPlaying] = createSignal(false)
    let [multitrack, setMultitrack] = createSignal<null | Multitrack>(null)
    // let [playlist, setPlaylist] = createSignal<null | any>(null)
    // let [wavesurfer, setWavesurfer] = createSignal<null | WaveSurfer>(null)

    onMount(async () => {
      if (playlistEl) {
        setMultitrack(Multitrack.create(
          [
            {
              id: 1,
              draggable: true,
              startPosition: 14, // start time relative to the entire multitrack
              url: 'https://mhvdtry1ty.ufs.sh/f/h6uI8ZTQyqbsRWz4c0IsIdJQyEcMOmFP14Nwbe6TZz8vjfLo',
              volume: 0.95,
              options: {
                waveColor: 'hsl(46, 87%, 49%)',
                progressColor: 'hsl(46, 87%, 20%)',
              },
            },
          ],
          {
            container: playlistEl, // required!
            minPxPerSec: 10, // zoom level
            rightButtonDrag: false, // set to true to drag with right mouse button
            cursorWidth: 2,
            cursorColor: '#D72F21',
            trackBackground: '#2D2D2D',
            trackBorderColor: '#7C7C7C',
            dragBounds: true,
          },
        ))
    }
    })

    onCleanup(() => {
      multitrack()?.destroy()
    })

    return (
        <div>
            <button style="position:relative; background-color: white;" onClick={() => {multitrack()?.isPlaying() ? multitrack()?.pause() : multitrack()?.play(); setIsPlaying(!isPlaying())}}>{isPlaying() ? 'Stop' : 'Play'}</button>
            <div style="position: relative;" ref={playlistEl}></div>
        </div>
    )
}
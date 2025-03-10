import { JSXElement } from "solid-js";
import { Embedder } from ".";

const urlRegex = /(?<=track\/)[a-zA-Z0-9]+/

// Generate Spotify embed code with the extracted spotify ID
const generate = (url: string): JSXElement => {
    const spotifyId = extractId(url)
    return (
        <iframe style="border-radius:12px" src={`https://open.spotify.com/embed/track/${spotifyId}`} width="100%" height="152" allowfullscreen={false} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    )
}

// Get the ID from the spotify Link
const extractId = (url: string) => {
    // Lookbehind track/ID. Spotify ID besteht aus Zahlen und Buchstaben
    const spotifyId = urlRegex.exec(url)
    return spotifyId ? spotifyId : ''
}

const validate = (url: string) => {
    const matches = urlRegex.test(url)
    return matches
}

export const spotifyEmbedder: Embedder = {
    generate,
    validate
}
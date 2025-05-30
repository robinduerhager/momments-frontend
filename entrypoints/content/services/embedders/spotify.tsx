import { JSXElement } from "solid-js";
import { Embedder } from ".";

// Regex to retrieve the Spotify Song ID from a Spotify Link.
// The ID is the part after "track/" and consists of alphanumeric characters.
const urlRegex = /(?<=track\/)[a-zA-Z0-9]+/

/**
 * @description Generates a spotify embed code for the given Spotify Link.
 * @param url The Spotify Link to generate the embed code for.
 * @returns A JSXElement representing the embed code.
 */
const generate = (url: string): JSXElement => {
    const spotifyId = extractId(url)
    return (
        <iframe style="border-radius:12px" src={`https://open.spotify.com/embed/track/${spotifyId}`} width="100%" height="152" allowfullscreen={false} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    )
}

/**
 * @description Extracts the Spotify ID from a given Spotify Link.
 * @param url The Spotify Link to extract the ID from.
 * @returns A string representing the Spotify ID, or an empty string if the ID could not be extracted.
 */
const extractId = (url: string) => {
    // Lookbehind track/ID. Spotify ID besteht aus Zahlen und Buchstaben
    const spotifyId = urlRegex.exec(url)
    return spotifyId ? spotifyId : ''
}

/**
 * @description Validates the given Spotify Link to check if it is a valid Spotify URL.
 * @param url The Spotify Link to validate.
 * @returns A boolean indicating whether the URL is valid for embedding.
 */
const validate = (url: string) => {
    const matches = urlRegex.test(url)
    return matches
}

export const spotifyEmbedder: Embedder = {
    generate,
    validate
}
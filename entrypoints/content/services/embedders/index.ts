import { JSXElement } from 'solid-js'
import { spotifyEmbedder } from './spotify'

export interface Embedder {
    generate(url: string): JSXElement
    validate(url: string): boolean
}

// Regex to identify Spotify URLs
const spotifyTypeRegex = /spotify\.com/

enum EmbedderSourceType {
    SPOTIFY = 'SPOTIFY',
}

/**
 * 
 * @description Identifies the source type of the given URL.
 * @param url The URL to identify the source type from.
 * @returns The identified source type or null if no match is found.
 */
const identifySource = (url: string): EmbedderSourceType | null => {
    if (spotifyTypeRegex.test(url))
        return EmbedderSourceType.SPOTIFY

    return null
}

/**
 * @description Generates an embed code based on the source type of the URL. Uses a specific embedder for each source type.
 * @param url The URL to generate the embed code for.
 * @returns A JSXElement representing the embed code or null if the URL is invalid.
 */
const generate = (url: string): JSXElement | null => {
    const sourceType = identifySource(url)

    if (sourceType === EmbedderSourceType.SPOTIFY){
        const validSpotifyURL = spotifyEmbedder.validate(url)

            if (!validSpotifyURL) {
                console.error('Invalid Spotify URL')
                return null
            }

        return spotifyEmbedder.generate(url)
    }
}

/**
 * 
 * @description Validates the URL based on the EmbedderSourceType.
 * @param url The URL to validate.
 * @returns A boolean indicating whether the URL is valid for embedding.
 */
const validate = (url: string): boolean => {
    const sourceType = identifySource(url)

    if (sourceType === EmbedderSourceType.SPOTIFY)
        return spotifyEmbedder.validate(url)

    return false
}

// Generates embeddings based on the input source URL
export const refSongEmbedder = {
    generate,
    validate
}

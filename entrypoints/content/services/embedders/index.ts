import { JSXElement } from 'solid-js'
import { spotifyEmbedder } from './spotify'

export interface Embedder {
    generate(url: string): JSXElement
    validate(url: string): boolean
}

const spotifyTypeRegex = /spotify\.com/

enum EmbedderSourceType {
    SPOTIFY = 'SPOTIFY',
}

const identifySource = (url: string): EmbedderSourceType | null => {
    if (spotifyTypeRegex.test(url))
        return EmbedderSourceType.SPOTIFY

    return null
}

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

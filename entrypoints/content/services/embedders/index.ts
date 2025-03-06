import { JSXElement } from 'solid-js'

export interface Embedder {
    generate(url: string): JSXElement
    validate(url: string): boolean
}

export { spotifyEmbedder } from './spotify'
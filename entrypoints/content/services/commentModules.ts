import axios from '$/utils/httpclient'
import { AudioFile } from './audioFiles'

export enum CommentModuleType {
    TEXT = 'TEXT',
    REFSONG = 'REFSONG',
    AUDIOMESSAGE = 'AUDIOMESSAGE',
    COMPOSITION = 'COMPOSITION'
}

export type CommentModuleDTO = {
    id: number
    commentId: number
    type: CommentModuleType
    text?: CommentTextModuleDTO
    refsong?: CommentRefSongModuleDTO
    audio?: CommentAudioMessageModuleDTO
    composition?: CommentCompositionModuleDTO
}

export type CommentTextModuleDTO = {
    id: number
    moduleId: number
    content: string
}

export type CommentRefSongModuleDTO = {
    id: number
    moduleId: number
    content: string
}

export type CommentAudioMessageModuleDTO = {
    id: number
    moduleId: number
    audioFile: AudioFile
}

export type CommentCompositionModuleDTO = {
    id: number
    moduleId: number
    audioTracks: AudioTracks[]
}

export type AudioTracks = {
    id: number
    startPosition: number,
    startCue: number,
    endCue: number
    audioFile: AudioFile
}

/**
 * @description Create a new text module for a comment.
 * @param commentId The ID of the comment to create the text module for.
 * @param content The content of the text module. 
 * @returns A Promise that resolves to the created Text Module.
 */
const createCommentTextModule = async ({ commentId, content }: {
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type: CommentModuleType.TEXT,
    content
})).data

/**
 * @description Create a new reference song module for a comment.
 * @param commentId The ID of the comment to create the reference song module for.
 * @param content The content of the reference song module, which right now should be a link to a spotify song, since there are no more implemented embedders.
 * @returns A Promise that resolves to the created Reference Song Module.
 */
const createCommentRefSongModule = async ({ commentId, content }: {
    commentId: number;
    content: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type: CommentModuleType.REFSONG,
    content
})).data

/**
 * @description Create a new audio message module for a comment.
 * @param commentId The ID of the comment to create the audio message module for.
 * @param audioFileName The 64-character random file name of the audio file from S3 to be associated with the audio message module.
 * @returns A Promise that resolves to the created Audio Message Module.
 */
const createCommentAudioMessageModule = async ({ commentId, audioFileName }: {
    commentId: number;
    audioFileName: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type: CommentModuleType.AUDIOMESSAGE,
    audioFileName
})).data

/**
 * @description Creates a new composition module for a comment.
 * @param commentId The ID of the comment to create the composition module for.
 * @param tracks An array of AudioTracks, each containing the fileId, startPosition, startCue, and endCue.
 * @returns A Promise that resolves to the created Composition Module.
 */
const createCommentCompositionModule = async ({ commentId, tracks }: {
    commentId: number
    tracks: {
        fileId: number
        startPosition: number,
        startCue: number,
        endCue: number
    }[]
}) => (await axios.post('/modules', {
    commentId,
    type: CommentModuleType.COMPOSITION,
    content: tracks
})).data

/**
 * @description Deletes a comment module by its ID.
 * @param commentModuleId The ID of the comment module to delete.
 * @returns A Promise that resolves to the ID of the deleted comment module.
 */
const deleteModule = async (commentModuleId: number) => (await axios.delete(`/modules`, {
    data: {
        commentModuleId
    }
})).data.id

export default {
    createCommentTextModule,
    createCommentRefSongModule,
    createCommentAudioMessageModule,
    createCommentCompositionModule,
    delete: deleteModule
}
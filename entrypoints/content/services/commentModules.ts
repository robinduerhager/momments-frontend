import axios from '$/utils/httpclient'
import { AudioFile } from './audioFiles'

// TODO: Add Composition Module
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

// TODO: Implement Composition Module
const createCommentTextModule = async ({ commentId, content }: {
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type: CommentModuleType.TEXT,
    content
})).data

const createCommentRefSongModule = async ({ commentId, content }: {
    commentId: number;
    content: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type: CommentModuleType.REFSONG,
    content
})).data

const createCommentAudioMessageModule = async ({ commentId, audioFileName }: {
    commentId: number;
    audioFileName: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type: CommentModuleType.AUDIOMESSAGE,
    audioFileName
})).data

const createCommendCompositionModule = async ({ commentId, tracks }: {
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

const deleteModule = async (commentModuleId: number) => (await axios.delete(`/modules`, {
    data: {
        commentModuleId
    }
})).data.id

export default {
    createCommentTextModule,
    createCommentRefSongModule,
    createCommentAudioMessageModule,
    createCommendCompositionModule,
    delete: deleteModule
}
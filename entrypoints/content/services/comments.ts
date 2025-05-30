import axios from '$/utils/httpclient'
import { UserDTO, CommentModuleDTO } from './';

export type CommentDTO = {
    id: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    published: boolean;
    author: UserDTO
    modules: CommentModuleDTO[]
}

/**
 * @description Create a new draft Comment for a Discussion.
 * @param discussionId The ID of the Discussion to create a draft for.
 * @returns A Promise that resolves to the created Comment draft.
 */
const createDraft = async (discussionId: number) => (await axios.post(`/comments`, {
    discussionId
})).data

/**
 * @description Publish a Comment by its ID, making it visible to other people in the RMCS.
 * @param commentId The ID of the Comment to publish.
 * @returns A Promise that resolves to the published Comment.
 */
const publishComment = async (commentId: number) => (await axios.patch(`/comments/${commentId}`, {
    published: true
})).data

export default {
    createDraft,
    publishComment,
}
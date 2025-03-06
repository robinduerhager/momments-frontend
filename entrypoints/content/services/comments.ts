import axios from '$/utils/httpclient'
import { UserDTO } from './';

export type CommentDTO = {
    id: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    published: boolean;
    author: UserDTO
    modules: any[]
}

// TODO: Add the rest of the CommentModule properties
export type CommentModuleDTO = {
    id: number;
}

// TODO: Add the rest of the CommentModules
export enum CommentModuleType {
    TEXT = 'TEXT',
}

// Create a Draft Comment on a Discussion
const createDraft = async (discussionId: number) => (await axios.post(`/discussions/${discussionId}/comments`)).data
// const getCommentsOfDiscussion = async (discussionId: number): Promise<CommentDTO[]> => (await axios.get('/comments', { params: { discussionId } })).data
const getComment = async (commentId: number) => (await axios.get(`/comments/${commentId}`)).data

const publishComment = async (commentId: number) => (await axios.patch(`/comments/${commentId}`, {
    published: true
})).data

// TODO: Implement the rest of the CommentModule types
const createCommentModule = async ({discussionId, commentId, type, content}: {
    discussionId: number;
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/discussions/${discussionId}/comments/${commentId}/modules`, {
    type,
    content
})).data

export default {
    createDraft,
    getComment,
    // getCommentsOfDiscussion,
    createCommentModule,
    publishComment
}
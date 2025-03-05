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

export type CommentModuleDTO = {
    id: number;
    
}

export enum CommentModuleType {
    TEXT = 'TEXT',
}

const createDraft = async (discussionId: number) => (await axios.post(`/discussions/${discussionId}/comments`)).data
// const getCommentsOfDiscussion = async (discussionId: number): Promise<CommentDTO[]> => (await axios.get('/comments', { params: { discussionId } })).data
const getComment = async (commentId: number) => (await axios.get('/comments', { params: { commentId } })).data

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
    createCommentModule
}
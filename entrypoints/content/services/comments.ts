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

// Create a Draft Comment on a Discussion
const createDraft = async (discussionId: number) => (await axios.post(`/comments`, {
    discussionId
})).data
// const getCommentsOfDiscussion = async (discussionId: number): Promise<CommentDTO[]> => (await axios.get('/comments', { params: { discussionId } })).data
const getComment = async (commentId: number) => (await axios.get(`/comments/${commentId}`)).data

const publishComment = async (commentId: number) => (await axios.patch(`/comments/${commentId}`, {
    published: true
})).data

export default {
    createDraft,
    getComment,
    publishComment,
}
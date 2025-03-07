import axios from '$/utils/httpclient'
import { Position } from '$/utils/types';
import { CommentDTO } from './';

export type DiscussionDTO = {
    id: number;
    posX: number;
    posY: number;
    comments: CommentDTO[]
    createdAt: Date;
    updatedAt: Date;
    readBy: boolean;
}

type ReducedDiscussion = Omit<DiscussionDTO, 'comments' | 'readBy'> & { readBy: boolean }

const createDiscussion = async (position: Position) => (await axios.post('/discussions', position)).data
const getDiscussions = async (): Promise<ReducedDiscussion[]> => (await axios.get('/discussions')).data

// UserId will be appended automatically through the Token
const getDiscussion = async (discussionId: number) => (await axios.get(`/discussions/${discussionId}`)).data
// const getCommentsOfDiscussion = async (discussionId: number): Promise<CommentDTO[]> => (await axios.get(`/discussions/${discussionId}/comments`)).data

export default {
    createDiscussion,
    getDiscussions,
    getDiscussion
}
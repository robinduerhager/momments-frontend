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
}

const createDiscussion = async (position: Position) => (await axios.post('/discussions', position)).data
const getDiscussions = async () => (await axios.get('/discussions')).data
const getCommentsOfDiscussion = async (discussionId: number): Promise<CommentDTO[]> => (await axios.get(`/discussions/${discussionId}/comments`)).data

export default {
    createDiscussion,
    getDiscussions,
    getCommentsOfDiscussion
}
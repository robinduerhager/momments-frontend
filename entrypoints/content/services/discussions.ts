import axios from '$/utils/httpclient'
import { Position } from '$/utils/types';

export type DiscussionDTO = {
    id: number;
    posX: number;
    posY: number;
    createdAt: Date;
    updatedAt: Date;
}

const createDiscussion = async (position: Position) => (await axios.post('/discussions', position)).data
const getDiscussions = async () => (await axios.get('/discussions')).data

export default {
    createDiscussion,
    getDiscussions
}
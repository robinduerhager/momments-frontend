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

/**
 * @description A reduced version of the DiscussionDTO, which only contains the ID, position and readBy status which is important for e.g. when we do not need to have access to all content when we just want to render all discussion bubbles on the RMCS
 */
type ReducedDiscussion = Omit<DiscussionDTO, 'comments' | 'readBy'> & { readBy: boolean }

/**
 * @description Store a new Discussion by providing a position.
 * @param position The position of the Discussion on the RMCS, which is used to place a new Discussion.
 * @returns A Promise that resolves to the created Discussion.
 */
const createDiscussion = async (position: Position) => (await axios.post('/discussions', position)).data

/**
 * @description Retrieve all Discussions in the RMCS.
 * @returns A Promise that resolves to an array of all Discussions, which only contain their ID, position and readBy status.
 */
const getDiscussions = async (): Promise<ReducedDiscussion[]> => (await axios.get('/discussions')).data

/**
 * @description Retrieve a Discussion by its ID, including all comments and their content.
 * @param discussionId The ID of the Discussion to retrieve.
 * @returns A Promise that resolves to the Discussion with all its comments and content.
 */
const getDiscussion = async (discussionId: number) => (await axios.get(`/discussions/${discussionId}`)).data

export default {
    createDiscussion,
    getDiscussions,
    getDiscussion
}
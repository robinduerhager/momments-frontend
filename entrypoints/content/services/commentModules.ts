import axios from '$/utils/httpclient'

// TODO: Add the rest of the CommentModules
export enum CommentModuleType {
    TEXT = 'TEXT',
    REFSONG = 'REFSONG'
}

// TODO: Implement the rest of the CommentModule types
const createCommentTextModule = async ({commentId, type, content}: {
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/comments/${commentId}/modules`, {
    type,
    content
})).data

const createCommentRefSongModule = async ({commentId, type, content}: {
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/comments/${commentId}/modules`, {
    type,
    content
})).data

export default {
    createCommentTextModule,
    createCommentRefSongModule
}
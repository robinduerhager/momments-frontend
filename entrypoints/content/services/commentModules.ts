import axios from '$/utils/httpclient'

// TODO: Add the rest of the CommentModules
export enum CommentModuleType {
    TEXT = 'TEXT',
    REFSONG = 'REFSONG'
}

export type CommentModuleDTO = {
    id: number
    commentId: number
    type: CommentModuleType
    text?: CommentTextModuleDTO
    refsong?: CommentRefSongModuleDTO
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

// model CommentModule {
//     id        Int         @id @default(autoincrement())
//     commentId Int
//     comment   Comment        @relation(fields: [commentId], references: [id])
//     type      ModuleType
//     text      TextModule?
//     refsong   RefSongModule?
//     // audio     AudioModule?
//   }
  
//   model TextModule {
//     id       Int @id @default(autoincrement())
//     content  String // Text des Kommentars
//     module   CommentModule? @relation(fields: [moduleId], references: [id])
//     moduleId Int @unique
//   }
  
//   model RefSongModule {
//     id       Int @id @default(autoincrement())
//     content  String //Refsong link
//     module   CommentModule? @relation(fields: [moduleId], references: [id])
//     moduleId Int @unique
//   }

// TODO: Implement the rest of the CommentModule types
const createCommentTextModule = async ({ commentId, type, content }: {
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type,
    content
})).data

const createCommentRefSongModule = async ({ commentId, type, content }: {
    commentId: number;
    type: CommentModuleType;
    content: string;
}) => (await axios.post(`/modules`, {
    commentId,
    type,
    content
})).data

const deleteModule = async (commentModuleId: number) => (await axios.delete(`/modules`, {
    data: {
        commentModuleId
    }
})).data.id

export default {
    createCommentTextModule,
    createCommentRefSongModule,
    delete: deleteModule
}